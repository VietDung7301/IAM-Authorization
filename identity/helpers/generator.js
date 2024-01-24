const base64 = require("base-64")
const e = require("express")
const utf8 = require("utf8")
const { generateKeyPairSync } = require("node:crypto")

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

function generateKeyPair() {
  const { publicKey, privateKey, } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: 'super duper secret',
    },
  })

  return { publicKey, privateKey }
}

module.exports = { generateCode, getDataFromCode, generateKeyPair }