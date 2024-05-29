package rate

import (
	"access/helpers/jwtparse"
	"access/helpers/responses"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
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
			responses.Response(w, http.StatusBadRequest, "rate limited!", nil)
			return
		}
	})
}

func rateLimit(client_id string, redisClient *redis.Client) bool {
	// 50 req/min
	defaultTimeUnit, err := strconv.Atoi(os.Getenv("RATE_TIME_UNIT"))
	if err != nil {
		defaultTimeUnit = 60
	}
	defaultCapacity, err := strconv.Atoi(os.Getenv("RATE_CAPACITY"))
	if err != nil {
		defaultCapacity = 50
	}
	var timeUnit, capacity int64
	var rateLimitData RateLimitData
	timeUnit = int64(defaultTimeUnit)
	capacity = int64(defaultCapacity)
	check := false

	// get rateLimitData
	redisKey := client_id
	ctx := context.Background()
	if redisClient.Exists(ctx, redisKey).Val() != 0 {
		//get key
		val, err := redisClient.Get(ctx, redisKey).Result()
		if err != nil {
			fmt.Printf("%s\n", err.Error())
			return false
		}
		json.Unmarshal([]byte(val), &rateLimitData)
	} else {
		// init key
		rateLimitData = RateLimitData{
			Prev_req_count: 0,
			Window_edge:    time.Now().Unix(),
			Cur_req_count:  0,
		}
	}

	// update value
	if (rateLimitData.Window_edge + timeUnit) <= time.Now().Unix() {
		if (rateLimitData.Window_edge + 2*timeUnit) <= time.Now().Unix() {
			rateLimitData.Prev_req_count = 0
		} else {
			rateLimitData.Prev_req_count = rateLimitData.Cur_req_count
		}
		rateLimitData.Cur_req_count = 0
		rateLimitData.Window_edge = time.Now().Unix()
	}

	// increase current count
	rateLimitData.Cur_req_count++

	// check ec
	ec := float64(rateLimitData.Prev_req_count)*((float64(timeUnit)-(float64(time.Now().Unix())-float64(rateLimitData.Window_edge)))/float64(timeUnit)) + float64(rateLimitData.Cur_req_count)
	if ec < float64(capacity) {
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
