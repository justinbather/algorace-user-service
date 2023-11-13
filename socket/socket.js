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
    const { username, lobby } = data;
    console.log('---------------------join lobby called');

    try {
      let lobbyObj = await Lobby.findOne({ name: lobby });

      if (lobbyObj) {
        const userExists = lobbyObj.users.some((user) => user.username === username);

        if (!userExists) {
          console.log('adding user to lobby');
          lobbyObj.users.push({ username, socketId: socket.id, isReady: false });
          lobbyObj = await lobbyObj.save();

          socket.join(lobbyObj.name);
          socket.emit('successful_enter', { lobbyObj });
          io.emit('user_joined', lobbyObj);
        } else {
          socket.emit('successful_enter', { lobbyObj });
          io.emit('user_joined', lobbyObj);

          console.log('error: user already in lobby');
        }
      } else {
        socket.emit('error_joining', 'No lobby name found');
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
      let lobbyObj = await Lobby.findOne({ name: lobby });

      if (lobbyObj) {
        const updatedUsers = lobbyObj.users.map(user => {
          if (user.username === username) {
            return { ...user, isReady: true }; // Make a copy with updated isReady
          }
          return user;
        });

        lobbyObj.users = updatedUsers;
        lobbyObj = await lobbyObj.save();

        io.to(lobby).emit('user_ready', lobbyObj);
        console.log('sending lobby object after readying: ', lobbyObj);
      } else {
        console.log('Error: Lobby not found');
      }
    } catch (error) {
      console.error('Error handling user_ready event:', error);
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
