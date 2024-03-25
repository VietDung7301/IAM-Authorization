package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
)

func main() {
	/*
	* rate limit based on IP
	* Finger print
	* locale mangagement
	 */

	/*
	* verifyToken()
	* verifyScopes()
	* forwardReq()
	 */

	/*
	* chuẩn bị đoạn code để đọc response
	* tạo response trait
	* refractor code
	 */

	r := mux.NewRouter()

	r.HandleFunc("/api/access_resource", accessResource).Methods("POST")

	http.ListenAndServe(":8004", r)
}

type ResponseBody struct {
	Method       string
	Url          string
	Content_type string
}

type ResponsePubKey struct {
	Public_key string
}

type ResponseCheck struct {
	Check bool
}

type ResponseResource struct {
	Code                     int
	Resource_server_response []byte
}

func accessResource(w http.ResponseWriter, r *http.Request) {
	var claims jwt.MapClaims
	authorization := r.Header.Get("Authorization")
	data := ResponseBody{
		Method:       r.FormValue("method"),
		Url:          r.FormValue("url"),
		Content_type: r.FormValue("content_type"),
	}

	if data.Method == "" || data.Url == "" || data.Content_type == "" {
		http.Error(w, "invalid request", 400)
		return
	}

	// verify access token
	if authorization != "" {
		authorization := strings.Split(authorization, " ")
		token := authorization[1]

		claims = verifyAccessToken(token)

		if claims == nil {
			http.Error(w, "unauthorized request - claims nil", http.StatusUnauthorized)
			return
		}
	} else {
		http.Error(w, "invalid request", 400)
		return
	}

	// verify scopes
	if !verifyScopes(data.Url, data.Method, claims["scope"]) {
		http.Error(w, "invalid scope", 400)
		return
	}

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
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer response.Body.Close()

	resData, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("ko doc duoc response\n")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	responseResource := ResponseResource{
		Code:                     response.StatusCode,
		Resource_server_response: resData,
	}

	jsonResponse, err := json.Marshal(responseResource)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func verifyAccessToken(tokenString string) jwt.MapClaims {
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})

	if err != nil || token == nil {
		fmt.Printf("error o day: %s\n", err.Error())
		return nil
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// get public key
		apiUrl := fmt.Sprintf("http://localhost:8000/api/auth/public_key?user_id=%s&client_id=%s", claims["sub"], claims["client_id"])
		response, err := http.Get(apiUrl)
		if err != nil {
			fmt.Printf("ko lay duoc public key: %s\n", err.Error())
			return nil
		}

		if response.StatusCode != 200 {
			fmt.Printf("status code != 200\n")
			return nil
		}

		responseData, err := io.ReadAll(response.Body)
		if err != nil {
			fmt.Printf("ko read duoc response body\n")
			return nil
		}

		var responseObject ResponsePubKey
		json.Unmarshal(responseData, &responseObject)

		// dùng public key để verify token
		key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(responseObject.Public_key))
		if err != nil {
			fmt.Printf("ko parse dc public key")
			return nil
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Don't forget to validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
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

	var responseCheck ResponseCheck
	err = json.Unmarshal(data, &responseCheck)
	if err != nil {
		fmt.Printf("ko parse duoc response\n")
		return false
	}

	return responseCheck.Check
}
