const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const auth = require("./routes/auth");
const problems = require("./routes/problems");
const lobby = require("./routes/lobby.js")

require('dotenv').config()

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }))

//Handle User authentication
app.use("/auth", auth);
//Handle fetching code problems
app.use("/problems", problems);
//Handle lobby operations
app.use("/lobby", lobby)


app.listen(PORT, () => console.log("Server running on port 8080!"));
