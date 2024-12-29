import {Server} from 'socket.io';


let IO;


export const CreateSocket = server => {
    IO = new Server(server,{
        cors:{
            allowedHeaders:true,
            credentials:true,
            origin:process.env.CLIENT_URICLIENT_URI
        }
    })
    return IO
}


