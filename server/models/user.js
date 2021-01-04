const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Message"
    }
  ],
  rooms: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Room"
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
