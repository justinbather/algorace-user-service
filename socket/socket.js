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
      let lobbyObj = await Lobby.findOne({ name: lobby });

      if (lobbyObj) {

        if (!lobbyObj.users.some(user => user.username === username)) {
          console.log('user not found in lobby, adding to array')
          lobbyObj.users.push({ username, isReady: false })
          const savedLobby = await lobbyObj.save()
          socket.join(savedLobby.name);
          socket.emit('successful_enter', savedLobby);
          io.emit('user_joined', savedLobby);
        } else {
          console.log('Prevented user from being duplicated')
        }
      } else {
        socket.emit('error', 'error joining this room')
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
      const lobbyObj = await Lobby.findOne({ name: lobby }).populate('users');

      if (lobbyObj) {
        lobbyObj.users.forEach((user) => {
          if (user.username === username) {
            user.isReady = true
            return;
          }
        })

        const savedLobby = await lobbyObj.save();

        socket.emit('successful_ready', { isReady: true })
        io.to(lobby).emit('user_ready', savedLobby);

        console.log('sending lobby object after readying: ', lobbyObj);
      } else {
        console.log('Error: Lobby not found');
      }
    } catch (error) {
      console.error('Error handling user_ready event:', error);
    }
  })

  socket.on('user_unready', async (data) => {
    const { username, lobby } = data;

    try {
      const lobbyObj = await Lobby.findOne({ name: lobby })

      if (lobbyObj) {
        lobbyObj.users.forEach((user) => {
          if (user.username === username) {
            user.isReady = false
            return;
          }
        })
      }
      const savedLobby = await lobbyObj.save()
      socket.emit('successful_ready', { isReady: false })
      io.to(lobby).emit('user_ready', savedLobby)
      console.log(savedLobby)
    } catch (err) {
      console.log(err)
    }
  })



  socket.on('testing', () => {
    console.log(socket.id)
  })

  socket.on("disconnect", async (lobby) => {
    const count = io.engine.clientsCount;
    console.log("num clients: ", count);
  })
});

module.exports = socketServer
