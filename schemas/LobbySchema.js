const mongoose = require("mongoose");

const LobbySchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  settings: Object,
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }],
  users: [
    {
      type: Object
    }
  ]

});

const Lobby = mongoose.model("Lobby", LobbySchema);

module.exports = Lobby;
