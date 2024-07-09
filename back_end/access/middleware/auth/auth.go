package auth

import (
	"access/helpers/jsonparse"
	"access/helpers/jwtparse"
	"access/helpers/responses"
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

type AuthMiddleware struct {
	RedisClient *redis.Client
}

func (amw *AuthMiddleware) Handler(next http.Handler) http.Handler {
	fmt.Printf("auth middleware in\n")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var claims jwt.MapClaims
		authorization := r.Header.Get("Authorization")
		if authorization != "" {
			authorization := strings.Split(authorization, " ")
			token := authorization[1]

			claims = verifyAccessToken(token, amw.RedisClient)

			if claims == nil {
				responses.Response(w, http.StatusUnauthorized, "token expired!", nil)
				return
			} else {
				fmt.Printf("auth middleware pass\n")
				next.ServeHTTP(w, r)
			}
		} else {
			responses.ResponseUnauthenticate(w)
			return
		}
	})
}

func verifyAccessToken(tokenString string, redisClient *redis.Client) jwt.MapClaims {
	claims := jwtparse.GetClaims(tokenString)

	if claims != nil {
		// get public key
		jti := claims["jti"]
		if jti == nil {
			fmt.Printf("token invalid!")
			return nil
		}
		sub := claims["sub"]
		if sub == nil {
			fmt.Printf("token invalid!")
			return nil
		}
		redisKey := fmt.Sprintf("%s@%sAccessToken", jti.(string), sub.(string))
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
