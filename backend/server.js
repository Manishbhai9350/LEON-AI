import http from 'http';
import { app } from './app.js';
import { CreateSocket } from './services/Socket.io.js';
import { Verify } from './services/jwt.js';
import { UserModel } from './models/User.model.js';


const {PORT} = process.env

const server = http.createServer(app)
const IO = CreateSocket(server)

IO.use( async (socket,next) => {
    try {
        const Token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1] 

        if(!Token) {
            throw new Error("UnAuthorized")
        }
        
        const Decoded = await Verify(Token)
        
        if (!Decoded) {
            throw new Error("UnAuthorized")
        }
        
        const User = await UserModel.findById(Decoded.id)
        
        if (!User) {
            throw new Error("UnAuthorized")
        }


        return next()

    } catch (error) {
        next(error)
    }
})

IO.on('connection',socket => {
    console.log(socket.id,' connected')
    socket.on('message',data => {
        console.log(data)
    })
})




server.listen(PORT)