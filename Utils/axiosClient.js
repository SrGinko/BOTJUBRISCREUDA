const axios = require('axios');
const { URL, API_MONTEIR_KEY } = process.env

const api = axios.create({
    baseURL: URL,
    headers: {
        apikey: API_MONTEIR_KEY
    }
})

module.exports = api 
