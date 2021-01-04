const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const Message = require("../models/message");
const Room = require("../models/room");
const User = require("../models/user");

exports.getRooms = async (req, res) => {
  const userId = req.userId;
  const userData = req.params;

  if (userId !== userData.userId) {
    return res.status(403).json("Unauthorized!");
  }

  let rooms = [];

  try {
    rooms = await Room.find().sort({ createdAt: -1 });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!rooms) {
    return res.status(404).json("No rooms found!");
  }

  res.status(200).json(rooms);
};

exports.createRoom = async (req, res) => {
  const userId = req.userId;
  const dbRoom = req.body;
  const imageUrl = req.file.filename;

  if (userId !== req.userId) {
    return res.status(403).json("Unauthorized!");
  }

  let foundUser;

  try {
    foundUser = await User.findOne({ _id: userId });
  } catch (err) {
    return res.status(403).json("Unauthorized!");
  }

  if (!foundUser) {
    return res.status(404).json("User not found!");
  }

  const room = new Room({
    ...dbRoom,
    imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imageUrl}`
  });

  let savedRoom;

  try {
    foundUser.rooms.push(room._id);
    await foundUser.save();

    savedRoom = await room.save();
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!savedRoom) {
    return res.status(500).json(err);
  }

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.filename,
    Body: fs.createReadStream(req.file.path),
    ACL: "public-read",
    ContentType: req.file.mimetype
  };

  s3.upload(params, (err, data) => {
    if (err) console.log(err);
    if (data) {
      fs.unlink(
        path.join(__dirname, "..", "public", "images", req.file.filename),
        (err) => {
          if (err) console.log(err);
        }
      );

      console.log("Image uploaded to AWS S3!");

      return res.status(201).json(room);
    }
  });
};

exports.getMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;

  let roomMessages;

  try {
    roomMessages = await Room.findById(roomId, {
      messages: 1,
      _id: 0
    }).populate("messages");
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!roomMessages) {
    return res.status(404).json("No messages found!");
  }

  res.status(200).json(roomMessages.messages);
};

exports.createMessage = async (req, res) => {
  const dbMessage = req.body;
  const userId = req.userId;

  if (userId !== dbMessage.userId) {
    return res.status(403).json("Unauthorized!");
  }

  let foundUser;

  try {
    foundUser = await User.findOne({ _id: userId });
  } catch (err) {
    return res.status(403).json("Unauthorized!");
  }

  if (!foundUser) {
    return res.status(404).json("User not found!");
  }

  const message = new Message(dbMessage);

  let room;

  try {
    room = await Room.findById(dbMessage.roomId);
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!room) {
    return res.status(404).json("No room found!");
  }

  let newMessage;

  try {
    foundUser.messages.push(message._id);
    await foundUser.save();

    room.messages.push(message._id);
    room.userId = userId;
    await room.save();

    newMessage = await message.save();
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!newMessage) {
    return res
      .status(422)
      .json("Something went wrong while trying to send your message!");
  }
  
  res.status(201).json(newMessage);
};
