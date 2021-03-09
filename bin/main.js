import dotenv from 'dotenv'
import { io } from 'socket.io-client'
import * as bot from '../src/module'
import helper from '../src/helper'

dotenv.config()

const socketServer = process.env.SOCKET_SERVER
const serverQueue = process.env.RABBIT_MQ_QUEUE
const socket = io(socketServer)
const botName = '/stock='

socket.on('connect', () => {
  console.log('bot connected')
  socket.emit('requestRoom', botName, (callback) => {
    console.log(`bot connected to room ${callback}`)
  })

  bot.consume((message) => {
    const parsedMessage = JSON.parse(message.content.toString())
    socket.emit(parsedMessage.roomId, parsedMessage)
  })
})

socket.on('run', (message) => {
  helper(message).then((data) => {
    bot.sendToQueue(data)
  })
})
setInterval(() => {
  socket.emit('ping', (callback) => {
    console.log(callback)
  })
}, 10000)

socket.on('disconnect', () => console.log('bot disconnected'))
