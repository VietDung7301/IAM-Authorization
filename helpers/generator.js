const base64 = require("base-64")
const e = require("express")
const utf8 = require("utf8")

function generateCode(data) {
  let encoded = base64.encode(utf8.encode(JSON.stringify(data)))
  return encoded
}

function getDataFromCode(code) {
  let data = ''
  try {
    let decoded = utf8.decode(base64.decode(code)) 
    data = JSON.parse(decoded)
  } catch (error) {
    console.log(error)
    return false
  }
  return data
}

module.exports = { generateCode, getDataFromCode }