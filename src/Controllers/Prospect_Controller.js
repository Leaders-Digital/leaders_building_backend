const prospectService = require("../service/prospect_service");

const createProspect = async (req, res) => {
  try {
    const prospect = await prospectService.createProspect(req.body);
    res.status(201).json({ message: "Prospect created", data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProspect = async (req, res) => {
  try {
    const prospect = await prospectService.deleteProspect(req.params.id);
    res.status(200).json({ message: "Prospect deleted", data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProspect = async (req, res) => {
  try {
    const prospect = await prospectService.updateProspect(
      req.params.id,
      req.body
    );
    res.status(200).json({ message: "Prospect updated", data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllProspects = async (req, res) => {
  try {
    const filters = req.body.filters || {};
    const { page, limit } = req.query;
    const search = req.query.search || "";

    const result = await prospectService.getAllProspects(
      page,
      limit,
      filters,
      search
    );

    res.status(200).json({
      success: true,
      message: "Prospects retrieved successfully",
      data: result.prospects,
      meta: {
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      },
    });
  } catch (error) {
    console.error("Error fetching prospects:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving prospects",
      error: error.message,
    });
  }
};

const getProspectById = async (req, res) => {
  try {
    const prospect = await prospectService.getProspectById(req.params.id);
    res.status(200).json({ data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const becomeClient = async (req, res) => {
  try {
    const prospect = await prospectService.becomeClient(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Prospect became a client", data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createProspect,
  deleteProspect,
  updateProspect,
  getAllProspects,
  getProspectById,
  becomeClient,
};
