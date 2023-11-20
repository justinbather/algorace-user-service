const createToken = require("../../config/createToken");
const User = require("../../schemas/UserSchema");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const Login = async (req, res) => {
  try {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({ message: "Username or password missing" });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const auth = bcrypt.compareSync(password, user.password);

    if (!auth) {
      return res.status(400).json({ message: "Incorrect email or password" });
    } else {
      const token = createToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        withCredentials: true,
        domain: `https://algorace-user-service-c4f17757eccb.herokuapp.com`,
        sameSite: 'None',
        secure: true
      });
      console.log(process.env.COOKIE_DOMAIN)
      console.log('set cookies successfully', res.cookie.token)
      return res.status(200).json({ message: "User logged in successfully" });
    }
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: "Error logging in user", error: err });
  }
};

module.exports = Login;
