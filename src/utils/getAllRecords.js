const getAllRecords = async (
  model,
  page,
  limit,
  filters = {},
  search = "",
  extraQuery = {},
  searchFields = ["name", "title"]
) => {
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const matchQuery = { ...extraQuery };

  if (search && search.trim() !== "") {
    console.log("Search term:", search);
    matchQuery.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  if (filters.date) {
    const { start, end } = filters.date;
    matchQuery.date = {
      ...(start && { $gte: new Date(start) }),
      ...(end && { $lte: new Date(end) }),
    };
  }

  for (const key in filters) {
    if (key !== "date") {
      matchQuery[key] = filters[key];
    }
  }

  // console.log("Match Query:", JSON.stringify(matchQuery, null, 2));

  const result = await model.aggregate([
    { $match: matchQuery },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limitNumber },
    {
      $facet: {
        data: [{ $project: { __v: 0, password: 0 } }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const records = result[0].data;
  const totalItems = result[0].totalCount[0]?.count || 0;

  return {
    records,
    totalItems,
    totalPages: Math.ceil(totalItems / limitNumber),
    currentPage: pageNumber,
  };
};

module.exports = getAllRecords;
