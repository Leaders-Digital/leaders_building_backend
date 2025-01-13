const User = require("../Models/User");
const path = require("path");
const fs = require("fs");

const createUser = async (req, res) => {
  const user = req.body;
  try {
    const existUser = await User.findOne({ email: user.email });
    if (existUser)
      return res.status(401).json({ message: "this email is already exist" });

    const newUser = new User(user);
    await newUser.save();
    return res.status(201).json({ message: "user created with sucess" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: `internal server error : ${e}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!(await User.exists({ _id: userId }))) {
      return res.status(401).json({ message: "there is no user by this id " });
    }
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { isDeleted: true },
      { new: true }
    );
    return res
      .status(201)
      .json({ message: `user updated : ${updatedUser}`, sucess: true });
  } catch (e) {
    console.log(e);
    return res.status(501).json({ message: `Internal server error : ${e}` });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const user = await User.findById(userId);
    if (!user)
      return res.status(401).json({ message: "there is no user by this id " });

    for (const key in updatedData) {
      if (updatedData[key] !== undefined && updatedData[key] !== user[key]) {
        user[key] = updatedData[key];
      }
      console.log("'user:", user);
      await user.save();
      return res.status(201).json({ message: "user updated" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: `internal server error : ${e}` });
  }
};
const uploaProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user)
      return res.status(401).json({ message: "there is no user by this id " });

    if (user.profilePic) {
      const oldPicPath = path.join(__dirname, "..", user.profilePic);
      if (fs.existsSync()) {
        fs.unlinkSync(oldPicPath);
      }
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    user.profilePic = image;
    await user.save();
    return res.status(201).json({ message: "pic uploaded" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: `internal server error :${e}` });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const PageNumber = parseInt(page);
    const LimitNumber = parseInt(limit);
    const skip = (PageNumber - 1) * LimitNumber;
    const Users = await User.find({ isDeleted: false })
      .select("-password")
      .skip(skip)
      .limit(LimitNumber)
      .sort({ createdAt: -1 });

    const totalItems = await User.countDocuments();
    return res.status(201).json({
      data: Users,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / LimitNumber),
      currentPage: PageNumber,
    });
  } catch (e) {
    return res.status(201).json({ message: `internal server error : ${e}` });
  }
};

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  uploaProfilePic,
  getAllUsers,
};
