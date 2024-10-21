import { io } from "socket.io-client";

class SocketioService {
  socket;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  setupSocketConnection(id) {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
      auth: {
        id,
      },
    });
    console.log(`Connecting socket...`);
    this.socket.emit("my message", "Hello there from Vue.");
    this.socket.on("my broadcast", (data) => {
      console.log(data);
    });
  }
  subscribeToMessages(cb) {
    if (!this.socket) return true;
    this.socket.on("message", (msg) => {
      console.log("Room event received!");
      return cb(null, msg);
    });
  }

  sendMessage({ message, roomName }, cb) {
    if (this.socket) this.socket.emit("message", { message, roomName }, cb);
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();
