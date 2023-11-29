const createToken = require("../../config/createToken");
const User = require("../../schemas/UserSchema");

const Signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.create({ username, password });

    const token = createToken(user._id);
    if (process.env.NODE_ENV === 'production') {
      res.cookie("token", token, {
        httpOnly: true,
        withCredentials: true,
        domain: 'algorace-user-service-c4f17757eccb.herokuapp.com',
        sameSite: 'None',
        secure: true
      })
      return res.status(201).json({ message: "User created in successfully" });
    } else {
      res.cookie("token", token, {
        httpOnly: true,
        withCredentials: true,
      })
      return res.status(201).json({ message: "User created in successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error creating user", error: err });
  }

};

module.exports = Signup;
