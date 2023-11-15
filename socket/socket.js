const socketIo = require("socket.io");
const express = require('express')
const http = require('http');
const Lobby = require("../schemas/LobbySchema");
const User = require('../schemas/UserSchema')
const app = express();
const PORT = 8000
const ProblemCode = require('../schemas/ProblemCodeSchema')


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

  socket.on('start_match', async (data) => {
    const { username, lobby } = data

    try {

      const lobbyObj = await Lobby.findOne({ name: lobby }).populate('problems').populate('host').exec()

      console.log(lobbyObj.host.username === username, lobbyObj.host.username, username)
      if (lobbyObj && lobbyObj.host.username === username) {

        console.log('starting match', lobbyObj.problems, lobbyObj.host)
        const currentProblem = await ProblemCode.findOne({ title: lobbyObj.problems[0].title, language: 'javascript' })
        io.to(lobby).emit('begin_match', { lobbyObj, roundNumber: 1, currentProblem })
      }
    } catch (err) {
      // Emit error here
      console.log('error starting match', err)
    }

  })

  socket.on('user_compiling', async (data) => {
    const { username, lobby } = data;

    try {
      io.to(lobby).emit('user_compiling', { username })

    } catch (err) {
      //Emit err here
      console.log(err)
    }

  })


  socket.on('user_completed', async (data) => {
    const { username, lobby } = data;

    try {

      const lobbyObj = await Lobby.findOne({ name: lobby }).populate('problems').exec()
      if (lobbyObj) {
        lobbyObj.currentRound = ++lobbyObj.currentRound
        const savedLobby = await lobbyObj.save()
        console.log(savedLobby.currentRound)
        if (savedLobby.currentRound > savedLobby.problems.length) {

          console.log('last round completed')
          io.to(lobby).emit('game_completed', (savedLobby))
          io.to(lobby).emit('game_completed', ({ savedLobby, winner: username }))
        } else {
          io.to(lobby).emit('round_completed', ({ savedLobby, winner: username }))
          console.log('next round')
        }
      }
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
