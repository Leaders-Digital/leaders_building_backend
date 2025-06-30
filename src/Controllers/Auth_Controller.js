const User = require("../Models/User");
const { generateToken } = require("../utils/JWTUtils");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "there is no user by this Id" });
    }
    
    const validePassword = await user.comparePassword(password);
    console.log(validePassword);

    if (!validePassword){
      return res.status(400).json({ message: "email or password incorrect"});
    }

    const token = generateToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      domain: process.env.NODE_ENV === 'production' ? '.leaders-building.com' : undefined,
    };

    console.log("Cookie options:", cookieOptions);
    console.log("NODE_ENV:", process.env.NODE_ENV);

    return res.cookie("token", token, cookieOptions)
      .json({
        message: "Login sucessful ",
        user: { email: user.email, userID: user._id, role: user.role },
      });
  } catch (e) {
    console.error("Login error:", e);
    return res
      .status(404)
      .json({ message: `internal server error ${e.message} ` });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "logout with sucess" });
  } catch (e) {
    return res
      .status(400)
      .json({ message: `internal server error : ${e.message}` });
  }
};

const GetCurrentUser = async (req, res) => {
  try {
    const id = req.userId.id;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "this user is not exist or removed" });
    }
    return res.status(200).json({ message: "sucess", data: user });
  } catch (e) {
    return res
      .status(401)
      .json({ message: `Internal server error ${e.message}` });
  }
};

const testAuth = async (req, res) => {
  try {
    // Log cookies for debugging
    console.log("Cookies received:", req.cookies);
    console.log("Headers received:", req.headers);
    
    return res.status(200).json({ 
      message: "Test endpoint working",
      cookies: req.cookies,
      hasToken: !!req.cookies.token
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = { login, logout, GetCurrentUser, testAuth };
