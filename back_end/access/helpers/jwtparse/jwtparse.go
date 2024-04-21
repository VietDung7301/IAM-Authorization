package jwtparse

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

func GetClaims(tokenString string) jwt.MapClaims {
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil || token == nil {
		fmt.Printf("error o day: %s\n", err.Error())
		return nil
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		return claims
	}
	return nil
}
