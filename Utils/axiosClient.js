const axios = require('axios');
const { URL, API_MONTEIR_KEY, URL_TESTES } = process.env

const api = axios.create({
    baseURL: URL,
    headers: {
        apikey: API_MONTEIR_KEY
    }
})

const apiTeste = axios.create({
    baseURL: URL_TESTES,
    headers: {
        apikey: API_MONTEIR_KEY
    }
})

module.exports = { api, apiTeste }