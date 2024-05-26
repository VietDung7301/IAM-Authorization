package ipgeo

import (
	"access/helpers/jsonparse"
	"access/helpers/jwtparse"
	"access/helpers/responses"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

type IpGeoMiddleware struct {
	RedisClient *redis.Client
}

type MarkedUserData struct {
	Is_checked  int    `json:"is_checked"`
	Checked_at  int64  `json:"checked_at"`
	Last_2FA_at string `json:"last_2FA_at"`
}

func (igmw *IpGeoMiddleware) Handler(next http.Handler) http.Handler {
	fmt.Printf("ip geo mdw in\n")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")
		if authorization == "" {
			responses.ResponseInvalidRequest(w)
			return
		}
		arr := strings.Split(authorization, " ")
		token := arr[1]
		claims := jwtparse.GetClaims(token)
		if claims == nil {
			responses.ResponseInvalidRequest(w)
			return
		}

		fmt.Printf("req ip addr: %s\n", r.Header.Get("X-FORWARDED-FOR"))
		if locationCheck(r.Header.Get("X-FORWARDED-FOR")) {
			fmt.Printf("ip geo mdw out\n")
			next.ServeHTTP(w, r)
		} else {
			var markedUserData MarkedUserData
			ctx := context.Background()
			redisKey := fmt.Sprintf("marked_user@%s", claims["sub"].(string))

			if igmw.RedisClient.Exists(ctx, redisKey).Val() != 0 {
				val, err := igmw.RedisClient.Get(ctx, redisKey).Result()
				if err != nil {
					fmt.Printf("Ko lay duoc marked user\n")
					responses.ResponseGeneralError(w, "internal server err")
					return
				}
				json.Unmarshal([]byte(val), &markedUserData)
				// nên set valid time ở env | default = 1 day
				if markedUserData.Is_checked == 1 && (markedUserData.Checked_at+86400) > time.Now().Unix() {
					fmt.Printf("ip geo mdw out\n")
					next.ServeHTTP(w, r)
					return
				}
			}

			// mark user
			markedUserData = MarkedUserData{
				Is_checked:  0,
				Checked_at:  0,
				Last_2FA_at: "",
			}
			// save to redis
			payload, err := json.Marshal(markedUserData)
			if err != nil {
				fmt.Printf("%s\n", err.Error())
			}

			err = igmw.RedisClient.Set(ctx, redisKey, payload, 0).Err()
			if err != nil {
				fmt.Printf("%s\n", err.Error())
			}

			// delete public key
			redisKey = fmt.Sprintf("%s@%sAccessToken", claims["client_id"].(string), claims["sub"].(string))
			err = igmw.RedisClient.Del(ctx, redisKey).Err()
			if err != nil {
				fmt.Printf("%s\n", err.Error())
			}

			redisKey = fmt.Sprintf("%s@%sRefreshToken", claims["client_id"].(string), claims["sub"].(string))
			err = igmw.RedisClient.Del(ctx, redisKey).Err()
			if err != nil {
				fmt.Printf("%s\n", err.Error())
			}

			// responses.Response(w, http.StatusBadRequest, "location invalid!", nil)
			responses.Response(w, http.StatusBadRequest, r.Header.Get("X-FORWARDED-FOR"), nil)
			return
		}
	})
}

func locationCheck(ipAddress string) bool {
	// make api call
	err := godotenv.Load()
	if err != nil {
		fmt.Printf("Error loading .env file - ipgeo\n")
	}
	client := &http.Client{}
	apiKey := os.Getenv("IP_GEO_API_KEY")
	apiUrl := os.Getenv("IP_GEO_URL")
	ipGeoApi := fmt.Sprintf("%s?apiKey=%s&ip=%s", apiUrl, apiKey, ipAddress)
	fmt.Printf("ipgeo api: %s\n", ipGeoApi)

	req, err := http.NewRequest(http.MethodGet, ipGeoApi, nil)
	if err != nil {
		fmt.Printf("ko tao dc req\n")
		return false
	}

	response, err := client.Do(req)
	if err != nil {
		fmt.Printf("api call error\n")
		return false
	}

	if response.StatusCode != 200 {
		fmt.Printf("status code: %d\n", response.StatusCode)
		errLogByte, _ := io.ReadAll(response.Body)
		errLog := string(errLogByte)
		fmt.Printf("%s\n", errLog)
		return false
	}
	defer response.Body.Close()

	resData, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("ko doc duoc response\n")
		return false
	}
	returnResource := jsonparse.JsonSimpleParse(resData)

	// temporary
	if _, ok := returnResource["country_code2"]; ok {
		if returnResource["country_code2"] == "VN" {
			return true
		}
	}

	if _, ok := returnResource["country_code3"]; ok {
		if returnResource["country_code3"] == "VNM" {
			return true
		}
	}

	return false
}
