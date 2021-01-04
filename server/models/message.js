const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  name: { type: String, required: true },
  timeStamp: {
    type: String,
    default: new Date(new Date().getTime() + 7200).toLocaleString()
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  roomId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
