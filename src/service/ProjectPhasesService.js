const getAllRecords = require("../utils/getAllRecords");
const ProjectPhases = require("../Models/ProjectPhases");

const DeleteProjectPhase = async (phaseId) => {
    const phaseExists = await ProjectPhases.exists({ _id: phaseId });
    if (!phaseExists) {
        throw new Error("There is no project phase by this ID");
    }

    const phase = await ProjectPhases.findByIdAndUpdate(
        { _id: phaseId },
        { isDeleted: true },
        { new: true }
    );

    return phase;
};

const UpdateProjectPhase = async (phaseId, updatedData) => {
    const phase = await ProjectPhases.findOne({
        _id: phaseId,
        isDeleted: false,
    });

    if (!phase) {
        throw new Error("There is no project phase by this ID");
    }

    console.log("Phase before:", phase.toObject());

    for (const key in updatedData) {
        if (
            updatedData[key] !== undefined &&
            updatedData[key] !== phase[key] &&
            key !== "_id"
        ) {
            phase[key] = updatedData[key];
            phase.markModified(key);
        }
    }

    await phase.save();

    console.log("Phase after:", phase.toObject());

    return phase;
};

const GetAllProjectPhases = async (page, limit, filters = {}, search = "") => {
    const extraQuery = { isDeleted: false };

    const searchFields = ["name", "status.type"];

    const result = await getAllRecords(
        ProjectPhases,
        page,
        limit,
        filters,
        search,
        extraQuery,
        searchFields
    );

    return {
        phases: result.records,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
    };
};

const GetProjectPhaseById = async (projectId) => {
    const phase = await ProjectPhases.find({
        projectId: projectId,
    }).populate('members');

    if (!phase) {
        throw new Error("There is no project phase by this ID");
    }

    return phase;
};



const CreateProjectPhase = async (data) => {
    try {
        const res = await new ProjectPhases(data);
        await res.save();
        return res;
    } catch (e) {
        throw e;
    }
};

module.exports = {
    CreateProjectPhase,
    DeleteProjectPhase,
    UpdateProjectPhase,
    GetAllProjectPhases,
    GetProjectPhaseById,
};
