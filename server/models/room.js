const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true,
      default: ""
    },
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        default: []
      }
    ],
    userId: {
      type: mongoose.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
