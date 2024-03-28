package responses

import (
	"encoding/json"
	"net/http"
)

type ResponseBody struct {
	Code    int
	Message string
	Data    []byte
}

func ResponseSuccess(w http.ResponseWriter, data []byte) {
	Response(w, http.StatusOK, "", data)
}

func ResponseInvalidRequest(w http.ResponseWriter, msg string) {
	Response(w, http.StatusBadRequest, "invalid request", nil)
}

func ResponseUnauthenticate(w http.ResponseWriter) {
	Response(w, http.StatusUnauthorized, "Unauthorized", nil)
}

// other response types go here

func Response(w http.ResponseWriter, statusCode int, msg string, data []byte) {
	/*
	* data nên được convert sang json trước sử dụng json.Marshal()
	 */

	response := ResponseBody{
		Code:    statusCode,
		Message: msg,
		Data:    data,
	}

	w.WriteHeader(statusCode)
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write(jsonResponse)
}
