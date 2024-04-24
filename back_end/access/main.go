package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"access/helpers/jsonparse"
	"access/helpers/redisconn"
	"access/helpers/responses"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
	"github.com/rs/cors"
)

var redisClient *redis.Client

func main() {
	/*
	* rate limit based on IP
	* Finger print
	* locale mangagement
	 */

	ctx := context.TODO()
	redisClient = redisconn.ConnectRedis(ctx)

	r := mux.NewRouter()

	r.HandleFunc("/api/access_resource", accessResource).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3001"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	http.ListenAndServe(":8004", handler)
}

type RequestBody struct {
	Method       string
	Url          string
	Content_type string
}

type RateLimitData struct {
	Prev_req_count int64
	Window_edge    int64
	Cur_req_count  int64
}

func accessResource(w http.ResponseWriter, r *http.Request) {
	var claims jwt.MapClaims
	authorization := r.Header.Get("Authorization")
	data := RequestBody{
		Method:       r.FormValue("method"),
		Url:          r.FormValue("url"),
		Content_type: r.FormValue("content_type"),
	}

	if data.Method == "" || data.Url == "" || data.Content_type == "" {
		responses.ResponseInvalidRequest(w)
		return
	}

	// verify access token
	if authorization != "" {
		authorization := strings.Split(authorization, " ")
		token := authorization[1]

		claims = verifyAccessToken(token)

		if claims == nil {
			responses.ResponseUnauthenticate(w)
			return
		}
	} else {
		responses.ResponseInvalidRequest(w)
		return
	}

	// rate limit
	if !rateLimit(claims["client_id"].(string)) {
		responses.ResponseInvalidRequest(w)
		return
	}

	// verify scopes
	// if !verifyScopes(data.Url, data.Method, claims["scope"]) {
	// 	responses.ResponseInvalidRequest(w)
	// 	return
	// }

	// response
	client := &http.Client{}
	req, err := http.NewRequest(data.Method, data.Url, nil)
	if err != nil {
		fmt.Printf("ko tao dc req\n")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	req.Header.Add("Content-Type", data.Content_type)

	response, err := client.Do(req)
	if err != nil {
		fmt.Printf("api call error\n")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if response.StatusCode != 200 {
		fmt.Printf("status code != 200\n")
		responses.Response(w, response.StatusCode, response.Status, nil)
	}
	defer response.Body.Close()

	resData, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("ko doc duoc response\n")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	returnResource := jsonparse.JsonSimpleParse(resData)
	// w.Header().Set("Content-Type", "application/json")
	responses.ResponseSuccess(w, returnResource)
}

func verifyAccessToken(tokenString string) jwt.MapClaims {
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})

	if err != nil || token == nil {
		fmt.Printf("error o day: %s\n", err.Error())
		return nil
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// get public key

		fmt.Printf("%f\n", claims["sub"])

		redisKey := fmt.Sprintf("%s@%dAccessToken", claims["client_id"], int(claims["sub"].(float64)))

		fmt.Printf("redisKey: %s\n", redisKey)

		ctx := context.Background()
		val, err := redisClient.Get(ctx, redisKey).Result()
		if err != nil {
			fmt.Printf("ko lay duoc public key: %s\n", err.Error())
			return nil
		}

		publicKey := jsonparse.JsonSimpleParse([]byte(val))

		// dùng public key để verify token
		key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKey["publicKey"].(string)))
		if err != nil {
			fmt.Printf("ko parse dc public key")
			return nil
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return key, nil
		})
		_ = token
		if err != nil {
			fmt.Printf("Verify token failed!: %s\n", err.Error())
			return nil
		}

		return claims
	}
	return nil
}

func verifyScopes(url_string string, method string, scopes interface{}) bool {
	client := &http.Client{}
	body := url.Values{}
	body.Set("url", url_string)
	body.Set("method", method)
	body.Set("scopes", scopes.(string))

	encodedBody := body.Encode()
	req, err := http.NewRequest(http.MethodPost, "http://localhost:8003/api/permission/check", strings.NewReader(encodedBody))
	if err != nil {
		fmt.Printf("ko tao dc req\n")
		return false
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response, err := client.Do(req)
	if err != nil {
		fmt.Printf("api call error\n")
		return false
	}

	if response.StatusCode != 200 {
		fmt.Printf("status code != 200\n")
		return false
	}
	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("ko doc duoc response\n")
		return false
	}

	responseCheck := jsonparse.JsonSimpleParse(data)

	return responseCheck["check"].(bool)
}

func rateLimit(client_id string) bool {
	/*
	* get rateLimitData
	*
	* if (window_edge + time_unit) <= cur_time() {
	* 	prev_req_count = cur_req_count;
	* 	cur_req_count = 0
	* }
	*
	* cur_req_count++
	*
	* calculate ec
	* if ec > capacity:
	* 	drop req
	*
	* forward req
	 */

	// 50 req/min
	const time_unit = 60
	const capacity = 50
	var rateLimitData RateLimitData
	check := false

	// get rateLimitData
	fmt.Printf("%s\n", client_id)
	redisKey := client_id
	ctx := context.Background()
	if redisClient.Exists(ctx, redisKey).Val() != 0 {
		//get key
		val, err := redisClient.Get(ctx, redisKey).Result()
		if err != nil {
			fmt.Printf("ko lay duoc gia tri ??: %s\n", err.Error())
			return false
		}
		json.Unmarshal([]byte(val), &rateLimitData)
	} else {
		// init key
		rateLimitData = RateLimitData{
			Prev_req_count: capacity,
			Window_edge:    time.Now().Unix(),
			Cur_req_count:  0,
		}
	}

	// update value
	if (rateLimitData.Window_edge + time_unit) <= time.Now().Unix() {
		rateLimitData.Prev_req_count = rateLimitData.Cur_req_count
		rateLimitData.Cur_req_count = 0
		rateLimitData.Window_edge = time.Now().Unix()
	}
	rateLimitData.Cur_req_count++

	// check ec
	ec := float64(rateLimitData.Prev_req_count)*((float64(time_unit)-(float64(time.Now().Unix())-float64(rateLimitData.Window_edge)))/float64(time_unit)) + float64(rateLimitData.Cur_req_count)
	if ec < capacity {
		check = true
	}

	// save to Redis
	payload, err := json.Marshal(rateLimitData)
	if err != nil {
		fmt.Printf("%s\n", err.Error())
	}

	err = redisClient.Set(ctx, client_id, payload, 0).Err()
	if err != nil {
		fmt.Printf("%s\n", err.Error())
	}
	return check
}
