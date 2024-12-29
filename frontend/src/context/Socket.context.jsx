import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function ConnectSocket() {
        console.log('Connecting To Socket  ',import.meta.env.VITE_SERVER_URL)
        const newSocket = await io(import.meta.env.VITE_SERVER_URL); // Update with your server URL
        setSocket(newSocket);
    }
    ConnectSocket()
    return () => {
        socket.close();
    };
  }, []);

  const listenEvent = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const emitEvent = (event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, listenEvent, emitEvent }}>
      {children}
    </SocketContext.Provider>
  );
};
