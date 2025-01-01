import { Server } from "socket.io";

let Io = null;

export const InitializeSockets = (server) => {
  // Should accept HTTP server, not Express app
  Io = new Server(server, {
    cors: {
      credentials: true, // Need CORS config to match frontend
    },
  });
  return Io;
};
export const EmitIO = (event, data) => {
  if (Io) {
    Io.emit(event, data);
  }
};

export const OnEvent = (event, cb) => {
  if (Io) {
    Io.on(event, cb);
  }
};

export const EmitSocket = (id, { event, data }) => {
  if (Io) {
    Io.to(id).emit(event, data);
  }
};
