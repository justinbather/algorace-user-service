const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const User = require('./schemas/UserSchema.js')
const auth = require("./routes/auth");
const problems = require("./routes/problems");
const verifyUser = require("./middleware/verifyUser");
const Lobby = require("./schemas/LobbySchema");
require('dotenv').config()
const socketServer = require('./socket/socket.js')

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;
const SOCKET_PORT = process.env.SOCKET_PORT || 8000;

app.use(express.json());
app.use(cookieParser());


app.use(cors({ origin: 'https://algorace-frontend.vercel.app', credentials: true }))

app.use("/auth", auth);

app.use("/problems", problems);

//Create a lobby
app.post("/lobby", verifyUser, async (req, res) => {
  const { name, selectedProblems, numRounds } = req.body;
  try {
    const exisiting = await Lobby.findOne({ name })
    if (exisiting) {
      return res.status(400).json({ message: "Lobby already exisits with that name" })
    }
    const host = await User.findById(req.user)
    const lobby = await Lobby.create({ name, host, numRounds });
    console.log(selectedProblems)
    selectedProblems.forEach((problem) => {
      lobby.problems.push(problem)
    })
    const savedLobby = await lobby.save()

    console.log(savedLobby)
    return res.status(201).json({ savedLobby });
  } catch (err) {
    console.log(err)

    return res
      .status(500)
      .json({ message: "Error, lobby could not be created", error: err });
  }
});

app.get('/deletelobs', async (req, res) => {
  try {
    const deletedItems = await Lobby.deleteMany({})
    return res.status(200).json(deletedItems)
  } catch (err) {
    return res.status(500).json(err)
  }
})

app.get('/lobby/:lobbyName', verifyUser, async (req, res) => {
  const { lobbyName } = req.params

  try {
    const lobby = await Lobby.findOne({ name: lobbyName })
    if (!lobby) {
      return res.status(404).json({ message: "No lobby found with that name" })
    }

    return res.status(200).json(lobby)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Error joining room" })
  }
})

//app.listen(PORT, () => console.log("Server running on port 8080!"));
socketServer.listen(SOCKET_PORT, () => console.log("Socket server listening on 8000"))
