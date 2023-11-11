const socketIo = require("socket.io");
const express = require('express')
const http = require('http');
const Lobby = require("../schemas/LobbySchema");
const app = express();
const PORT = 8000


const socketServer = http.createServer(app);


const io = socketIo(socketServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const lobbies = []


io.on("connection", (socket) => {
  console.log("Socket connected: ", socket.id);

  socket.on("create_lobby", (data) => {

    const { user, lobby, problems } = data

    if (!lobbies[lobby]) {
      const newLobby = {
        host: user.username,
        problems,
        users: [{ user: user.username, id: socket.id }],
      }

      lobbies[lobby] = newLobby

    }

  });


  socket.on("join_lobby", async (data) => {
    const { username, lobby } = data
    const lobbyObj = await Lobby.findOne({ name: lobby })
    if (lobbyObj) {
      console.log(socket.id)
      lobbyObj.users.push({ username: username, socketId: socket.id, isReady: false })
      await lobbyObj.save()
      socket.join(lobbyObj.name)
      socket.emit('successful_enter', { lobbyObj })
      io.to(lobby).emit('user_joined', lobbyObj.users)
      console.log(lobbyObj)
    } else {
      socket.emit('error_joining', "No lobby name found")
    }
  });

  socket.on("user_ready", async (data) => {
    const { username, lobby } = data
    const lobbyObj = await Lobby.findOne({ name: lobby })
    const setReady = lobbyObj.users.forEach(user => {
      if (user.username === username) {
        user.isReady = true
        return;
      }
    });
    await lobbyObj.save()
    io.to(lobby).emit('user_ready', lobbyObj.users)
  })

  socket.on('testing', () => {
    console.log(socket.id)
  })

  socket.on("disconnect", async (lobby) => {
    const count = io.engine.clientsCount;
    console.log("num clients: ", count);
  });
});

module.exports = socketServer
