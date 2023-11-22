const Lobby = require('../../schemas/LobbySchema')

const getLobby = async (req, res) => {
  const { lobbyName } = req.params

  try {
    const lobby = await Lobby.findOne({ name: lobbyName })
    if (!lobby) {
      return res.status(404).json({ message: "No lobby found with that name" })
    }

    return res.status(200).json(lobby)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Error joining room" })
  }
}

module.exports = getLobby
