const Lobby = require('../../schemas/LobbySchema')
const User = require('../../schemas/UserSchema')

const createLobby = async (req, res) => {
  const { name, selectedProblems, numRounds } = req.body;
  try {
    //Check if lobby already exists with that name
    const exisiting = await Lobby.findOne({ name })
    if (exisiting) {
      return res.status(400).json({ message: "Lobby already exisits with that name" })
    }
    const host = await User.findById(req.user)
    const lobby = await Lobby.create({ name, host, numRounds });
    selectedProblems.forEach((problem) => {
      lobby.problems.push(problem)
    })
    const savedLobby = await lobby.save()

    return res.status(201).json({ savedLobby });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error, lobby could not be created", error: err });
  }
}

module.exports = createLobby
