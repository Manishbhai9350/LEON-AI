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
          token: localStorage.getItem("auth/v1"),
        },
        query: {
          ProjectID,
        },
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

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      console.log("Socket disconnected");
      setSocket(null); // Clear the socket state
    }
  };

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

  const removeListener = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, listenEvent, emitEvent, removeListener, ConnectSocket, disconnectSocket, setSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
