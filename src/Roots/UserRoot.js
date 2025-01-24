const express = require("express");
const {
  createUser,
  deleteUser,
  updateUser,
  uploaProfilePic,
  getAllUsers,
} = require("../Controllers/User_Controller");
const upload = require("../Middlewares/upload");
const {
  getAllArchivedUsers,
  unArchivedUser,
} = require("../Controllers/ArchivedUserController");
const userRouter = express.Router();

userRouter.post("/createUser", createUser);
userRouter.put("/deleteUser/:id", deleteUser);
userRouter.put("/updateUser/:id", updateUser);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.put("/uploadPic/:id", upload.single("profilePic"), uploaProfilePic);
userRouter.get("/ArchivedUsers", getAllArchivedUsers);
userRouter.put("/unArchivedUser/:id", unArchivedUser);
module.exports = userRouter;
