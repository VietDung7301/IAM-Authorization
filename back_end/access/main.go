package main

import (
	"context"
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"os"

	"access/helpers/jsonparse"
	"access/helpers/mysqlconn"
	"access/helpers/redisconn"
	"access/helpers/responses"

	"access/middleware/auth"
	"access/middleware/cors"
	"access/middleware/ipgeo"

	"access/middleware/rate"
	"access/middleware/scope"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

var redisClient *redis.Client
var mysqlInstance *sql.DB

type RequestBody struct {
	Method       string
	Url          string
	Content_type string
}

func main() {
	// Load env
	err := godotenv.Load()
	if err != nil {
		fmt.Printf("Error loading .env file - main\n")
	}

	// redis conn instance
	ctx := context.TODO()
	redisClient = redisconn.ConnectRedis(ctx)

	// mysql conn instance
	mysqlInstance = mysqlconn.ConnectMySQL()

	r := mux.NewRouter()

	// init middleware
	amw := auth.AuthMiddleware{
		RedisClient: redisClient,
	}
	rmw := rate.RateMiddleware{
		RedisClient: redisClient,
	}
	smw := scope.ScopeMiddleware{
		//
	}
	igmw := ipgeo.IpGeoMiddleware{
		RedisClient:   redisClient,
		MysqlInstance: mysqlInstance,
	}

	// use middleware
	r.Use(cors.Handler)
	r.Use(amw.Handler)
	r.Use(rmw.Handler)
	r.Use(igmw.Handler)
	r.Use(smw.Handler)

	r.HandleFunc("/api/access_resource", accessResource).Methods("POST", http.MethodOptions)

	port := fmt.Sprintf(":%s", os.Getenv("PORT"))
	http.ListenAndServe(port, r)
}

func accessResource(w http.ResponseWriter, r *http.Request) {
	// set required headers
	w.Header().Add("Content-Type", "application/json")

	// var claims jwt.MapClaims
	data := RequestBody{
		Method:       r.FormValue("method"),
		Url:          r.FormValue("url"),
		Content_type: r.FormValue("content_type"),
	}

	if data.Method == "" || data.Url == "" || data.Content_type == "" {
		fmt.Printf("ko co method, url, content_type\n")
		responses.ResponseInvalidRequest(w)
		return
	}

	// response
	client := &http.Client{}
	req, err := http.NewRequest(data.Method, data.Url, nil)
	if err != nil {
		fmt.Printf("ko tao dc req\n")
		responses.ResponseGeneralError(w, err.Error())
		return
	}
	req.Header.Add("Content-Type", data.Content_type)

	response, err := client.Do(req)
	if err != nil {
		fmt.Printf("api call error\n")
		responses.ResponseGeneralError(w, err.Error())
		return
	}

	if response.StatusCode != 200 {
		fmt.Printf("status code != 200\n")
		responses.Response(w, response.StatusCode, response.Status, nil)
		return
	}
	defer response.Body.Close()

	resData, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("ko doc duoc response\n")
		responses.ResponseGeneralError(w, err.Error())
		return
	}

	returnResource := jsonparse.JsonSimpleParse(resData)
	responses.ResponseSuccess(w, returnResource)
}
