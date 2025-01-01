import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const ConnectSocket = async (ProjectID) => {
    const Token = localStorage.getItem("auth/v1");
    console.log("Connecting To Socket  ", import.meta.env.VITE_SERVER_URL);
    if (Token) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL, {
        auth: {
          token:localStorage.getItem("auth/v1"),
        },
        query:{
          ProjectID
        }
      });

      newSocket.on('connect_error', (err) => {
        console.error("Connection Error: ", err);
      });

      setSocket(newSocket);

      // Log socket connection status
      newSocket.on('connect', () => {
        console.log("Socket connected with ID: ", newSocket.id);
      });
    }
  };

  useEffect(() => {
    return () => {
      socket?.disconnect(); // Disconnect socket on cleanup
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
    <SocketContext.Provider
      value={{ socket, listenEvent, emitEvent, ConnectSocket, setSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
