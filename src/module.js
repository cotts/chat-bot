#!/usr/bin/env node
import amqp from 'amqplib'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.RABBITMQ_SERVER
const connectionQueue = process.env.RABBITMQ_QUEUE

/**
 * Connect to RABBITMQ Server
 * @returns {RabbitMQ Channel}
 */
const connect = () =>
  amqp.connect(connectionString).then((conn) => conn.createChannel())

/**
 * Create RabbitMQ Queue
 * @param {RabbitMQ Channel} channel
 * @param {RabbitMQ Queue} queue
 * @returns {Channel Queue}
 */
const createQueue = (channel) =>
  new Promise((resolve, reject) => {
    try {
      channel.assertQueue(connectionQueue, { durable: true })
      resolve(channel)
    } catch (err) {
      reject(err)
    }
  })

/**
 * Producer - Send message to RabbitMQ Channel Queue
 * @param {Channel Queue} queue
 * @param {String} message
 */
const sendToQueue = (message) =>
  connect()
    .then((channel) => createQueue(channel, connectionQueue))
    .then((channel) =>
      channel.sendToQueue(connectionQueue, Buffer.from(message))
    )
    .catch(console.log)

/**
 * Consumer - read messages from Channel Queue
 * @param {Channel Queue} queue
 * @param {Callback} callback
 */
const consume = (callback) =>
  connect()
    .then((channel) => createQueue(channel, connectionQueue))
    .then((channel) =>
      channel.consume(connectionQueue, callback, { noAck: true })
    )
    .catch(console.log)

/**
 *  consume the socketIO instance and send message from queue
 * @param {SocketIO} Socket
 */
const startConsumer = (socket) => {
  consume(connectionQueue, (message) => {
    const parsedMessage = JSON.parse(message.content.toString())
    socket.to(parsedMessage.roomId).emit('message', parsedMessage)
  })
}

export { sendToQueue, startConsumer, consume }
