const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const auth = require("./routes/auth");
const problems = require("./routes/problems");

connectDB();

const app = express();
const PORT = 8080;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", auth);
app.use("/problems", problems);

app.listen(PORT, () => console.log("Server running on port 8080!"));
