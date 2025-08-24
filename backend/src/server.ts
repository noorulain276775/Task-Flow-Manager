// src/server.ts
import { createServer } from "http";
import { AppDataSource } from "./utils/dataSource";
import app from "./app";
import { initWebSocket } from "./services/websocket";

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

// Initialize WebSocket
initWebSocket(httpServer);

// Connect to DB & start server
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Process terminated');
  });
});
