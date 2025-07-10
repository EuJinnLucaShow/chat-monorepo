import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      );
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketManager = new SocketManager();
