// src/socket.ts
import { io } from "socket.io-client";

// connect to backend
const socket = io("http://localhost:3000");

export default socket;
