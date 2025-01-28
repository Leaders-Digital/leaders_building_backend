const getAllRecords = async (
  model,
  req,
  res,
  searchFields = ["name", "lastName", "email", "status"],
  filters = {}
) => {
  try {
    const { page = 1, limit = 10, search = "", select = "" } = req.query;

    const PageNumber = parseInt(page);
    const LimitNumber = parseInt(limit);

    const skip = (PageNumber - 1) * LimitNumber;

    const searchString = String(search || "").trim();
    if (select) filters.status = select;
    const matchQuery = { ...filters };

    if (searchString) {
      matchQuery.$or = searchFields.map((field) => ({
        [field]: { $regex: searchString, $options: "i" },
      }));
    }

    const records = await model
      .find(matchQuery)
      .select("-password")
      .skip(skip)
      .limit(LimitNumber)
      .sort({ createdAt: -1 });

    const totalItems = await model.countDocuments(matchQuery);

    return res.status(200).json({
      data: records,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / LimitNumber),
      currentPage: PageNumber,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: `Internal server error: ${e.message}` });
  }
};

module.exports = getAllRecords;
