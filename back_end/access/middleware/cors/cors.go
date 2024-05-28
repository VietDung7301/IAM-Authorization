package cors

import (
	"fmt"
	"net/http"
)

func Handler(next http.Handler) http.Handler {
	fmt.Printf("cors mdw in\n")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token")
		w.Header().Add("Access-Control-Allow-Credentials", "true")
		w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("content-type", "application/json;charset=UTF-8")
		if r.Method == "OPTIONS" {
			fmt.Printf("cors mdw out - option method\n")
			w.WriteHeader(http.StatusNoContent)
			return
		}
		fmt.Printf("cors mdw out\n")
		next.ServeHTTP(w, r)
	})
}
