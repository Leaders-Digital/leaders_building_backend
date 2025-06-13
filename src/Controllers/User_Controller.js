const User = require("../Models/User");
const path = require("path");
const fs = require("fs");
const { stringify } = require("querystring");
const {generatePassword} = require("../utils/generatePassword");
const sendEmail = require("../utils/mailSender");
const Prospect = require("../Models/Prospect");

const createUser = async (req, res) => {
  const user = req.body;
  const subject = "Bienvenue chez Leaders-Building !";

  try {
    const existUser = await User.findOne({ email: user.email });
    if (existUser)
      return res.status(400).json({ message: "this email is already exist" });


    if(!user.password && user.role === "client"){
      const prospect=await Prospect.findById(user.clientId)
      prospect.type='client';
      await prospect.save()
      const generatedPassword=generatePassword()
      user.password = generatedPassword;
      const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div style="background-color: #005c80; color: white; padding: 20px; text-align: center;">
<img src="cid:logo" alt="Logo" style="height: 60px; margin-bottom: 10px;" />
        <h2 style="margin: 0;">Bienvenue chez Leaders-Building</h2>
      </div>
      <div style="padding: 30px; color: #333;">
        <p>Bonjour <b>${user.name}</b>,</p>
        <p>Votre compte a été créé avec succès. Vous pouvez dès maintenant accéder à notre application mobile.</p>
        <p><b>Voici votre mot de passe temporaire :</b></p>
        <p style="font-size: 20px; background-color: #f0f0f0; padding: 10px 15px; border-radius: 5px; display: inline-block;">
          ${generatedPassword}
        </p>
        <p>Nous vous recommandons de le changer après votre première connexion.</p>
        <a href="https://play.google.com/store" style="display: inline-block; margin-top: 20px; background-color: #004080; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Accéder à l'application</a>
        <p style="margin-top: 30px;">Cordialement,<br>L’équipe Leaders-Building</p>
      </div>
    </div>
  </div>
`;

      await sendEmail({ to: user.email, subject, html });

    }


    const newUser = new User(user);
    await newUser.save();
    return res.status(201).json({ message: "user created with sucess" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: `internal server error : ${e.message}` });
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
      .json({ message: `user deleted : ${updatedUser}`, sucess: true });
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
    const newdata = updatedData;
    for (const key in newdata) {
      if (newdata[key] !== undefined && newdata[key] !== user[key]) {
        user[key] = newdata[key];
      }
    }
  console.log()
    await user.save();
    return res.status(201).json({ message: "user updated" });
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
    const { page = 1, limit = 10, role = "", search = "" } = req.query;
    const PageNumber = parseInt(page);
    const LimitNumber = parseInt(limit);
    const searchString = String(search || "").trim();

    const skip = (PageNumber - 1) * LimitNumber;
    const filter = { isDeleted: false, role: { $in: ['user', 'admin'] } };
    if (role && role !== "undefined") filter.role = role;

    if (search) {
      filter.$or = [
        { name: { $regex: searchString, $options: "i" } },
        { lastName: { $regex: searchString, $options: "i" } },
        { email: { $regex: searchString, $options: "i" } },
      ];
    }

    const Users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(LimitNumber)
      .sort({ createdAt: -1 });

    const totalItems = await User.countDocuments(filter);
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
const getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, role = "", search = "" } = req.query;
    const PageNumber = parseInt(page);
    const LimitNumber = parseInt(limit);
    const searchString = String(search || "").trim();

    const skip = (PageNumber - 1) * LimitNumber;
    const filter = { isDeleted: false, role: 'client' };
    if (role && role !== "undefined") filter.role = role;

    if (search) {
      filter.$or = [
        { name: { $regex: searchString, $options: "i" } },
        { lastName: { $regex: searchString, $options: "i" } },
        { email: { $regex: searchString, $options: "i" } },
      ];
    }

    const Users = await User.find(filter)
        .select("-password")
        .skip(skip)
        .limit(LimitNumber)
        .sort({ createdAt: -1 });

    const totalItems = await User.countDocuments(filter);
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
const getClientById = async (req, res) => {
  const {id} = req?.params;
  try {

  const Client= await User.findById(id)
    if (!Client){
      res.status(404).json({ message: "client not found" });
    }
    return res.status(201).json(

        Client);
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
  getAllClients,
  getClientById
};
