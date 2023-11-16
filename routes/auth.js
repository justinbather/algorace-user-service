const express = require("express");
const Signup = require("../controllers/auth/Signup");
const Login = require("../controllers/auth/Login");
const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
});

// Used to add protected routes on client side
router.get("/verify", verifyUser, (req, res) => {

  res.status(200).json({ userData: { username: req.username, userId: req.user } });
});

module.exports = router;
