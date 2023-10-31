const express = require("express");
const Signup = require("../controllers/auth/Signup");
const Login = require("../controllers/auth/Login");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.sendStatus(200);
});

module.exports = router;
