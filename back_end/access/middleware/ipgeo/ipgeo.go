package ipgeo

import (
	"access/helpers/jwtparse"
	"access/helpers/responses"
	"database/sql"
	"os"
	"strconv"

	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"time"

	"github.com/ip2location/ip2location-go/v9"
	"github.com/redis/go-redis/v9"
)

type IpGeoMiddleware struct {
	RedisClient   *redis.Client
	MysqlInstance *sql.DB
}

type MarkedUserData struct {
	Is_checked  int    `json:"is_checked"`
	Checked_at  int64  `json:"checked_at"`
	Last_2FA_at string `json:"last_2FA_at"`
}

type Country struct {
	Id            int            `json:"id"`
	Country_short sql.NullString `json:"country_short"`
	Country_long  sql.NullString `json:"country_long"`
	Region        sql.NullString `json:"region"`
	City          sql.NullString `json:"city"`
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

		ips := strings.Split(r.Header.Get("X-FORWARDED-FOR"), ", ")
		fmt.Printf("req ip addr: %s\n", ips[0])

		if locationCheckV2(ips[0], igmw.MysqlInstance) {
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
				cooldownTime, err := strconv.Atoi(os.Getenv("COOLDOWN_TIME"))
				if err != nil {
					cooldownTime = 86400
				}
				if markedUserData.Is_checked == 1 && (markedUserData.Checked_at+int64(cooldownTime)) > time.Now().Unix() {
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
			redisKey = fmt.Sprintf("%s@%sAccessToken", claims["jti"].(string), claims["sub"].(string))
			err = igmw.RedisClient.Del(ctx, redisKey).Err()
			if err != nil {
				fmt.Printf("%s\n", err.Error())
			}

			redisKey = fmt.Sprintf("%s@%sRefreshToken", claims["jti"].(string), claims["sub"].(string))
			err = igmw.RedisClient.Del(ctx, redisKey).Err()
			if err != nil {
				fmt.Printf("%s\n", err.Error())
			}

			responses.Response(w, http.StatusBadRequest, "location invalid!", nil)
			return
		}
	})
}

func locationCheckV2(ipAddress string, countriesdb *sql.DB) bool {
	db, err := ip2location.OpenDB("./assets/IP2LOCATION-LITE-DB11/IP2LOCATION-LITE-DB11.BIN")
	if err != nil {
		fmt.Print(err)
		return false
	}

	results, err := db.Get_all(ipAddress)
	if err != nil {
		fmt.Print(err)
		return false
	}
	db.Close()

	// fmt.Printf("country_short: %s\n", results.Country_short)
	// fmt.Printf("country_long: %s\n", results.Country_long)
	// fmt.Printf("region: %s\n", results.Region)
	// fmt.Printf("city: %s\n", results.City)
	// fmt.Printf("latitude: %f\n", results.Latitude)
	// fmt.Printf("longitude: %f\n", results.Longitude)
	// fmt.Printf("zipcode: %s\n", results.Zipcode)
	// fmt.Printf("timezone: %s\n", results.Timezone)

	// query countries
	countries, err := countriesdb.Query("SELECT * FROM countries")
	if err != nil {
		fmt.Printf("%s\n", err.Error())
	}
	defer countries.Close()

	for countries.Next() {
		var country Country
		err = countries.Scan(&country.Id, &country.Country_short, &country.Country_long, &country.Region, &country.City)
		if err != nil {
			fmt.Printf("%s\n", err.Error())
		}

		// check country
		if (country.Country_short.Valid && results.Country_short == country.Country_short.String) ||
			(country.Country_long.Valid && results.Country_long == country.Country_long.String) {
			fmt.Printf("valid ipgeo!\n")
			return true
		}

		// check region - future implement

		// check city - future implement
	}

	return false
}
