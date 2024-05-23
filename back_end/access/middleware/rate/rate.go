package rate

import (
	"access/helpers/jwtparse"
	"access/helpers/responses"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

type RateMiddleware struct {
	RedisClient *redis.Client
}

type RateLimitData struct {
	Prev_req_count int64
	Window_edge    int64
	Cur_req_count  int64
}

func (rmw *RateMiddleware) Handler(next http.Handler) http.Handler {
	fmt.Printf("rate mdw in\n")
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

		if rateLimit(claims["client_id"].(string), rmw.RedisClient) {
			fmt.Printf("rate mdw out\n")
			next.ServeHTTP(w, r)
		} else {
			responses.ResponseInvalidRequest(w)
			return
		}
	})
}

func rateLimit(client_id string, redisClient *redis.Client) bool {
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
	redisKey := client_id
	ctx := context.Background()
	if redisClient.Exists(ctx, redisKey).Val() != 0 {
		//get key
		val, err := redisClient.Get(ctx, redisKey).Result()
		if err != nil {
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
