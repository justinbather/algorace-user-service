const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const auth = require("./routes/auth");
const problems = require("./routes/problems");
const verifyUser = require("./middleware/verifyUser");
const Lobby = require("./schemas/LobbySchema");

connectDB();

const app = express();
const PORT = 8080;

//Socket requires http server to function
const server = http.createServer(app);

//Socket io Setup

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected: ", socket.id);

  socket.on("create_lobby", (data) => {
    const { user, lobby } = data;
    socket.join(lobby);
    console.log("created lobby: ", lobby);
  });

  socket.on("join_lobby", (lobby) => {
    socket.join(lobby);
    console.log("Joined lobby: ", lobby);
    const count = io.engine.clientsCount;
    console.log("num clients: ", count);
    // io.emit("user_joined", "A new user joined");
  });

  socket.on("disconnect", () => {
    const count = io.engine.clientsCount;
    console.log("num clients: ", count);
  });
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", auth);

app.use("/problems", problems);

//Create a lobby
app.post("/lobby", verifyUser, async (req, res) => {
  const { name, settings } = req.body;
  try {
    const lobby = await Lobby.create({ user: req.user, name, settings });

    return res.status(201).json({ lobby });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error, lobby could not be created", error: err });
  }
});

server.listen(PORT, () => console.log("Server running on port 8080!"));
