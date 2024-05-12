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
	"strings"

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

		if locationCheck(r.RemoteAddr) {
			next.ServeHTTP(w, r)
		} else {
			// mark user
			ctx := context.Background()
			redisKey := fmt.Sprintf("marked_user@%s", claims["sub"].(string))
			markedUserData := MarkedUserData{
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

			responses.ResponseInvalidRequest(w)
			return
		}
	})
}

func locationCheck(ipAddress string) bool {
	// make api call
	client := &http.Client{}
	apiKey := "ba175d74993e4030a4e0e2afb1c07ba6" // chuyen sang env
	ipGeoApi := fmt.Sprintf("https://api.ipgeolocation.io/ipgeo?apiKey=%s&ip=%s", apiKey, ipAddress)
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
