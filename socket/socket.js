const socketIo = require("socket.io");
const express = require('express')
const http = require('http');
const Lobby = require("../schemas/LobbySchema");
const User = require('../schemas/UserSchema')
const app = express();
const PORT = 8000


const socketServer = http.createServer(app);


const io = socketIo(socketServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const lobbies = []

const checkAllReady = (lobbyObj) => {
  let output = true
  lobbyObj.users.forEach(user => {
    if (!user.isReady) {
      output = false
    }

  });
  return output
}


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
    const { username, lobby } = data;
    console.log('---------------------join lobby called');

    try {
      const result = await Lobby.findOneAndUpdate(
        { name: lobby, 'users.username': { $ne: username } }, // Ensure username is not in the array
        { $addToSet: { users: { username, isReady: false } } },
        { new: true }
      );

      if (result) {
        socket.join(result.name);
        socket.emit('successful_enter', result);
        io.emit('user_joined', result);
      } else {
        console.log('Prevented user from being duplicated');
      }
    } catch (error) {
      console.error('Error joining lobby:', error);
      socket.emit('error_joining', 'Internal server error');
    }
  });

  socket.on("user_ready", async (data) => {
    console.log('--------------user ready called');
    const { username, lobby } = data;

    try {
      const savedLobby = await Lobby.findOneAndUpdate(
        { name: lobby, 'users.username': username },
        { $set: { 'users.$.isReady': true } },
        { new: true }
      );

      socket.emit('successful_ready', { isReady: true });
      io.to(lobby).emit('user_ready', savedLobby);

      console.log('sending lobby object after readying: ', savedLobby);
      console.log(socket.id, username);
    } catch (error) {
      console.error('Error handling user_ready event:', error);
    }
  });

  socket.on('user_unready', async (data) => {
    const { username, lobby } = data;

    try {
      const savedLobby = await Lobby.findOneAndUpdate(
        { name: lobby, 'users.username': username },
        { $set: { 'users.$.isReady': false } },
        { new: true }
      );

      socket.emit('successful_ready', { isReady: false });
      io.to(lobby).emit('user_ready', savedLobby);
      console.log(savedLobby);
    } catch (err) {
      console.log(err);
    }
  });


  socket.on('testing', () => {
    console.log(socket.id)
  })

  socket.on("disconnect", async (lobby) => {
    const count = io.engine.clientsCount;
    console.log("num clients: ", count);
  })
});

module.exports = socketServer
