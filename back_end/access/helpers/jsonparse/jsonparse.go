package jsonparse

import "encoding/json"

func JsonSimpleParse(jsonStr []byte) map[string]interface{} {
	var result map[string]interface{}

	json.Unmarshal(jsonStr, &result)

	return result
}

func JsonArrayParse(jsonStr []byte) []map[string]interface{} {
	var results []map[string]interface{}

	json.Unmarshal(jsonStr, &results)

	return results
}
