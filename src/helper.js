import axios from 'axios'
import csv from 'csvtojson'

/**
 *  Get Stock CSV String given a code
 * @param {String} code - Stock Code
 * @returns {Promise}
 */
const getCsvInfo = (code) => {
  return axios
    .get(`https://stooq.com/q/l/?s=${code}&f=sd2t2ohlcv&h&e=csv,`)
    .then((data) => data.data)
    .catch((error) => {
      console.log(error)
      return error.message
    })
}

/**
 *  Convert content string to JSON
 * @param {String} content
 * @returns {Object}
 *
 */
const convertCsvToJson = (content) =>
  csv({ noheader: false })
    .fromString(data.data)
    .then((rows) => rows[0])

/**
 * Extract code from string
 * @param {String} message
 * @returns {String}
 */
const getCode = (message) => {
  const code = message.split('/stock=')
  if (code.length > 1) return code[1].toLowercase()
  throw new Error('Stock Code cannot be blank')
}

