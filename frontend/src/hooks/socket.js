import { useContext } from 'react';
import { SocketContext } from '../context/Socket.context.jsx';

export const useSocket = () => {
    const  IOConnection = useContext(SocketContext);
    if (!IOConnection) {
        throw new Error("useSocket must be used in Socket Context Provider")
    }
    return IOConnection;
};
