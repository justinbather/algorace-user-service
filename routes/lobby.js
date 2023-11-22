const express = require('express');
const verifyUser = require('../middleware/verifyUser');
const createLobby = require('../controllers/lobbys/createLobby')
const getLobby = require('../controllers/lobbys/getLobby')

const router = express.Router()

router.post('/', verifyUser, createLobby)
router.get('/:lobbyName', verifyUser, getLobby)

router.delete('/', async (req, res) => {
  try {
    const deletedItems = await Lobby.deleteMany({})
    return res.status(200).json(deletedItems)
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router
