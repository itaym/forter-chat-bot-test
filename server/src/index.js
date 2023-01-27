import * as dotenv from 'dotenv'
import Messaging from './Messaging.js'
import OpenAiMessaging from './OpenAiMessaging.js'
import chatManagement from './chatManagement.js'
import cors from 'cors'
import express from 'express'
import httpServer from 'http'
import { Server } from 'socket.io'

dotenv.config()

const app = express()

app.use(cors())

const http =  httpServer.createServer(app)

http.listen(3000, () => {
    console.log('listening on *:3000')
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})

chatManagement(io, 'chat', Messaging)
chatManagement(io, 'bot', OpenAiMessaging)

