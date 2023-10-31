const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const accounts = require("./routes/accounts");

connectDB();

const app = express();
const PORT = 8080;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/auth", accounts);

app.listen(PORT, () => console.log("Server running on port 8080!"));
