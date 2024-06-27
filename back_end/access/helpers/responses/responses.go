package responses

import (
	"encoding/json"
	"net/http"
)

type ResponseBody struct {
	Code    int         `json:"status_code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func ResponseSuccess(w http.ResponseWriter, data interface{}) {
	Response(w, http.StatusOK, "Success!", data)
}

func ResponseInvalidRequest(w http.ResponseWriter) {
	Response(w, http.StatusBadRequest, "invalid request", nil)
}

func ResponseUnauthenticate(w http.ResponseWriter) {
	Response(w, http.StatusUnauthorized, "Unauthorized", nil)
}

func ResponseGeneralError(w http.ResponseWriter, msg string) {
	Response(w, http.StatusInternalServerError, msg, nil)
}

// other response types go here

func Response(w http.ResponseWriter, statusCode int, msg string, data interface{}) {
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
