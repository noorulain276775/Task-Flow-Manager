// src/services/websocket.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initWebSocket = (server: HttpServer) => {
  io = new Server(server, { 
    cors: { 
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"]
    } 
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("update_task", (task) => {
      io.emit("task_update", { type: "task_update", data: task });
    });

    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
  });
};

const wsService = {
  broadcast: (message: { type: string; data: any }) => {
    if (io) io.emit(message.type, message.data);
  }
};

export default wsService;
