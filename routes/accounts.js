const express = require("express");
const Signup = require("../controllers/accounts/Signup");

const router = express.Router();

router.post("/signup", Signup);

module.exports = router;
