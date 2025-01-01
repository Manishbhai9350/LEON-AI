//Editing From Mobile


import http from 'http';
import { app } from './app.js';
import { Verify } from './services/jwt.js';
import { UserModel } from './models/User.model.js';
import { Server } from 'socket.io';
import { InitializeSockets, OnEvent } from './services/Socket.io.js';
import RedisCLI from './services/Redis.js';
import { IsUserAuthenticated } from './middleware/Auth.js';
import { ProjectModel } from './models/Project.model.js';
import mongoose from 'mongoose';

const {PORT} = process.env

const server = http.createServer(app)

// Initialize socket.io
const IO = InitializeSockets(server);
// Use middleware for socket authentication
IO.use(async (socket, next) => {
    const Token = socket.handshake.auth.token || socket.handshake.headers?.authorization?.split(' ')[1]; // Assuming token is sent in handshake
    const { ProjectID } = socket.handshake.query;

    if (!Token) {
        return next(new Error('Unauthorized'));
    }

    // Validate ProjectID as a mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(ProjectID)) {
        return next(new Error('Invalid ProjectID'));
    }

    const IsBlackListed = await RedisCLI.get(Token);
    if (IsBlackListed) {
        return next(new Error('Unauthorized'));
    }

    try {
        const Decoded = await Verify(Token);
        const User = await UserModel.findById(Decoded.id);
        if (!User) {
            return next(new Error('Unauthorized'));
        }
        const Project = await ProjectModel.findById(ProjectID);
        socket.Project = Project; // Attach Project to socket
        socket.User = User; // Attach User to socket
        next();
    } catch (error) {
        next(new Error('Unauthorized'));
    }
});
IO.on('connection', socket => { 
    const ProjectID = socket.Project._id;
    console.log(ProjectID);
    socket.join(ProjectID.toString());
    
    socket.on('project-message', data => {
        // Emit the message to all users in the room
        console.log(data, ProjectID);
        socket.to(ProjectID.toString()).emit('project-message-receive', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected from project: ${ProjectID}`);
        socket.leave(ProjectID.toString());
    });
});

server.listen(PORT)