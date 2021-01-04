const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Message = require("../models/message");
const Room = require("../models/room");

exports.signup = async (req, res) => {
  const userData = req.body;
  const imageUrl = req.file.filename;

  let foundUser;

  try {
    foundUser = await User.findOne({ email: userData.email });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (foundUser) {
    return res.status(422).json("Email already exists!");
  }

  const hashedPassword = bcrypt.hashSync(userData.password, 12);

  const user = new User({
    ...userData,
    password: hashedPassword,
    imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imageUrl}`
  });

  let createdUser;

  try {
    createdUser = await user.save();
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!createdUser) {
    return res.status(422).json("Could not create new user!");
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: createdUser._id.toString(),
        username: createdUser.username,
        email: createdUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
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
    if (data && createdUser) {
      fs.unlink(
        path.join(__dirname, "..", "public", "images", req.file.filename),
        (err) => {
          if (err) console.log(err);
        }
      );

      console.log("Image uploaded to AWS S3!");

      return res.status(201).json({ user: createdUser, token });
    }
  });
};

exports.login = async (req, res) => {
  const userData = req.body;

  let foundUser;

  try {
    foundUser = await User.findOne({ email: userData.email });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(404).json("Could not find user!");
  }

  const comparedPassword = bcrypt.compareSync(
    userData.password,
    foundUser.password
  );

  if (!comparedPassword) {
    return res.status(422).json("Password is incorrect!");
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: foundUser._id.toString(),
        email: foundUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.status(500).json(err);
  }

  res.status(200).json({ user: foundUser, token });
};

exports.deleteAccount = async (req, res) => {
  const userId = req.userId;
  const userData = req.params;

  if (userData.userId !== userId) {
    return res.status(403).json("Unauthorized!");
  }

  let foundUser;

  try {
    foundUser = await User.findOne({ _id: userId });
  } catch (err) {
    return res.status(500).json(err);
  }

  if (!foundUser) {
    return res.status(404).json("User not found!");
  }

  let messages;

  try {
    messages = await Message.find({ userId: userId });
  } catch (err) {
    return res.status(500).json(err);
  }

  let rooms;

  try {
    rooms = await Room.find({ userId: userId });
  } catch (err) {
    return res.status(500).json(err);
  }

  try {
    if (messages) {
      await Message.deleteMany({ userId });
    }

    if (rooms) {
      await Room.deleteMany({ userId });
    }

    await User.deleteOne({ _id: userId });
  } catch (err) {
    return res.status(500).json(err);
  }

  res.status(200).json("User deleted!");
};
