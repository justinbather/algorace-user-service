const express = require("express");
const Signup = require("../controllers/auth/Signup");
const Login = require("../controllers/auth/Login");
const verifyUser = require("../middleware/verifyUser");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", (req, res) => {
  console.log(res.cookie.token);
  res.clearCookie("token");
  console.log(res.cookie.token);
  res.sendStatus(200);
});
router.get("/verify", verifyUser, (req, res) => {
  console.log(req.user);
  res.sendStatus(200);
});

module.exports = router;
