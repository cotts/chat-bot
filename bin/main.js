import dotenv from 'dotenv'
import { io } from 'socket.io-client'
import * as bot from '../src/module'
import helper from '../src/helper'

dotenv.config()

const socketServer = process.env.SOCKET_SERVER
const serverQueue = process.env.RABBIT_MQ_QUEUE
const socket = io(socketServer)

socket.on('connect', () => {
  console.log('bot connected')
  socket.emit('request', 'botRoom')

  bot.consume((message) => {
    const parsedMessage = JSON.parse(message.content.toString())
    socket.emit(parsedMessage.roomId, parsedMessage)
  })
})

socket.on('runbot', (message) => {
  helper(message).then((data) => {
    bot.sendToQueue(data)
  })
})

socket.on('disconnect', () => console.log('bot disconnected'))
