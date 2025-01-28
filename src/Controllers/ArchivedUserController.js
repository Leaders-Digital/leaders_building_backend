const User = require("../Models/User");

const getAllArchivedUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    const PageNumber = parseInt(page);
    const LimitNumber = parseInt(limit);
    const searchString = String(search || "").trim();

    const skip = (PageNumber - 1) * LimitNumber;
    const filter = { isDeleted: true };
    if (role && role !== "undefined") filter.role = role;

    if (search && search.trim() !== "") {
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
    console.log("archived users", Users);
    const totalItems = await User.countDocuments(filter);

    return res.status(200).json({
      data: Users,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / LimitNumber),
      currentPage: PageNumber,
    });
  } catch (e) {
    return res.status("400").json({ message: `internal server error :${e}` });
  }
};

const unArchivedUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    user.isDeleted = false;
    await user.save();

    return res
      .status(200)
      .json({ message: "user unarchived", data: user, sucess: true });
  } catch (e) {
    return res.status(500).json({ message: `internal server error :${e}` });
  }
};
module.exports = {
  getAllArchivedUsers,
  unArchivedUser,
};
