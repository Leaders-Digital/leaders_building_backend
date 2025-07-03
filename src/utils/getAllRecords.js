const { default: mongoose } = require("mongoose");

const getAllRecords = async (
  model,
  req,
  res,
  searchFields = ["name", "lastName", "email", "status"],
  filters = {},
  sortField = "createdAt",
  objectIdFields = [],
  populateFields = []
) => {
  try {
    const { page = 1, limit = 100, search = "", select = "" } = req.query;

    const PageNumber = parseInt(page);
    const LimitNumber = parseInt(limit);
    const skip = (PageNumber - 1) * LimitNumber;

    const searchString = String(search || "").trim();
    if (select) filters.status = select;
    const matchQuery = { ...filters };

    if (searchString) {
      matchQuery.$or = [];

      const textSearchFields = searchFields.filter(
        (f) => !objectIdFields.includes(f)
      );
      if (textSearchFields.length > 0) {
        matchQuery.$or.push(
          ...textSearchFields.map((field) => ({
            [field]: { $regex: searchString, $options: "i" },
          }))
        );
      }

      if (
        objectIdFields.length > 0 &&
        mongoose.Types.ObjectId.isValid(searchString)
      ) {
        matchQuery.$or.push(
          ...objectIdFields.map((field) => ({
            [field]: new mongoose.Types.ObjectId(searchString),
          }))
        );
      }

      if (matchQuery.$or.length === 0) {
        delete matchQuery.$or;
      }
    }

    const sortOrder = { [sortField]: -1, _id: -1 }; // Add _id as secondary sort for consistency
    let query = model
      .find(matchQuery)
      .select("-password")
      .skip(skip)
      .limit(LimitNumber)
      .sort(sortOrder);


    populateFields.forEach(field => {
      query = query.populate(field);
    });

    const records = await query;
    const totalItems = await model.countDocuments(matchQuery);
    
    console.log(`getAllRecords - Model: ${model.modelName}, Page: ${PageNumber}, Limit: ${LimitNumber}, Skip: ${skip}`);
    console.log(`getAllRecords - Total items: ${totalItems}, Records returned: ${records.length}`);
    console.log(`getAllRecords - Match query:`, JSON.stringify(matchQuery, null, 2));
    console.log(`getAllRecords - Records IDs:`, records.map(r => r._id));

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
