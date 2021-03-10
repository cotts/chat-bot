import axios from 'axios'
import csv from 'csvtojson'

/**
 *  Get Stock CSV String given a code
 * @param {String} code - Stock Code
 * @returns {resolve Promise(Object), reject Promise(String)}
 */
const getCsvInfo = (code) => {
  return axios({
    method: 'GET',
    urhl: `https://stooq.com/q/l/?s=${code}&f=sd2t2ohlcv&h&e=csv,`,
    headers: '',
  })
    .then((data) => data.data)
    .catch((error) => {
      console.log(error)
      return { error: 'Error on Retrieve Stock Information' }
    })
}

/**
 *  Convert content string to JSON
 * @param {String} content
 * @returns {Object}
 *
 */
const convertCsvToJson = (content) =>
  content.error
    ? content
    : csv({ noheader: false })
        .fromString(content)
        .then((rows) => rows[0])

/**
 * Extract code from string
 * @param {String} message
 * @returns {String}
 */
const getCode = async (message) => {
  const code = message.split('/stock=')
  if (code.length > 1) return code[1].toLowerCase()
}

/**
 * Parser message to send to Queue
 * @param {Object} data
 * @param {String} room
 * @returns {String} string from message
 */
const parserMessage = async (data, room) => {
  const message = !data
    ? 'Stock Code cannot be blank'
    : data.error
    ? data.error
    : data.Time === 'N/D' && data.Open === 'N/D'
    ? 'Invalid Stock Code'
    : `${data.Symbol} quote is $${data.Open} per share`

  const sendObject = {
    message,
    name: 'Bot',
    roomId: room,
    bot: true,
    _id: new Date().getTime(),
    createdAt: new Date(),
  }

  return JSON.stringify(sendObject)
}

const prepareMessage = (messageContent) => {
  const { message, roomId } = messageContent
  return getCode(message)
    .then(getCsvInfo)
    .then(convertCsvToJson)
    .then((data) => parserMessage(data, roomId))
    .catch((error) => parserMessage(error, roomId))
}

export default prepareMessage
