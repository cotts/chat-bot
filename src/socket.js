import dotenv from 'dotenv'
import { io } from 'socket.io-client'

dotenv.config()

const socket = io(process.env.SOCKET_SERVER)

export default socket