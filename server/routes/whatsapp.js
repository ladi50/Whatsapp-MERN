const router = require("express").Router();

const appControllers = require("../controllers/whatsapp");
const userControllers = require("../controllers/user");
const imageUpload = require("../middlewares/upload/imageUpload");
const verifyToken = require("../middlewares/token/verifyToken");

router.post("/signup", imageUpload.single("imageUrl"), userControllers.signup);

router.post("/login", userControllers.login);

router.use(verifyToken);

router.get("/rooms/:userId", appControllers.getRooms);

router.post(
  "/room/new",
  imageUpload.single("imageUrl"),
  appControllers.createRoom
);

router.get("/:roomId/messages", appControllers.getMessagesByRoom);

router.post("/messages/new", appControllers.createMessage);

router.delete("/:userId/delete", userControllers.deleteAccount)

module.exports = router;
