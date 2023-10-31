const createToken = require("../../config/createToken");
const User = require("../../schemas/UserSchema");

const Signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.create({ username, password });
    const token = createToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    return res.status(201).json({ user, message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error creating user", error: err });
  }
};

module.exports = Signup;
