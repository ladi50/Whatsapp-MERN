require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Pusher = require("pusher");

const whatsappRoutes = require("./routes/whatsapp");
const Message = require("./models/message");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public", "images")));

app.use(cors());
app.use(bodyParser.json());

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

app.use(whatsappRoutes);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => app.listen(PORT))
  .catch((err) => {
    throw new Error(err);
  });

mongoose.connection.once("open", () => {
  Message.watch().on("change", (change) => {
    if (change.operationType === "insert") {
      pusher
        .trigger("messages", "inserted", { ...change.fullDocument })
        .then()
        .catch((err) => console.log(err));
    }
  });
});
