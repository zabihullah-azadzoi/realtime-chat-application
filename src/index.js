const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Filter = require("bad-words");
const { messageFunction, locationFunction } = require("./utils/methods");
const qs = require("query-string");
const {
  createNewUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/user");

const filter = new Filter();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || 3000;

// let count = 0;

io.on("connection", (socket) => {
  socket.on("join", (data, callback) => {
    const query = qs.parse(data);
    const userName = query.username;
    const room = query.room;
    const user = createNewUser(socket.id, userName, room);
    if (user.error) {
      return callback(user.error);
    }
    socket.join(user.room);
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageFunction(socket.id, userName, `${user.userName} has connected`)
      );
    io.to(user.room).emit("join", getUsersInRoom(user.room));
  });

  socket.on("message", (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      if (filter.isProfane(message)) {
        return socket.emit(
          "message",
          messageFunction(socket.id, user.userName, "includes profanity")
        );
      }
      io.to(user.room).emit(
        "message",
        messageFunction(socket.id, user.userName, message)
      );
      callback("message has been deliverd successfully");
    }
  });

  socket.on("shareLocation", (location) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "shareLocation",
        locationFunction(
          socket.id,
          user.userName,
          `https://www.google.com/maps?s=${location.latitude},${location.longitude}`
        )
      );
    }
  });

  // media streaming
  socket.on("newMediaConnection", (id) => {
    const user = getUser(socket.id);
    socket.to(user.room).emit("newMediaConnection", id);
    console.log("server is also done!");
  });

  // socket.on("call", (id) => {
  //   const user = getUser(socket.id);
  //   io.to(user.room).emit("call", id);
  // });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        messageFunction(
          socket.id,
          user.userName,
          `${user.userName} has left the room`
        )
      );
      io.to(user.room).emit("join", getUsersInRoom(user.room));
    }
  });
});

server.listen(port, () => {
  console.log("server is up on 3000");
});
