const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const auth = require("./routes/auth");

connectDB();

const app = express();
const PORT = 8080;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/auth", auth);

app.listen(PORT, () => console.log("Server running on port 8080!"));
