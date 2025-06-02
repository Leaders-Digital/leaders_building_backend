

const ProjectPhases = require("../Models/ProjectPhases");
const {
    CreateProjectPhase,
    DeleteProjectPhase,
    UpdateProjectPhase,
    GetAllProjectPhases,
    GetProjectPhaseById,
} = require("../service/ProjectPhasesService");
const { getProspectById } = require("../service/prospect_service");
const getAllRecords = require("../utils/getAllRecords");

const createProjectPhase = async (req, res) => {
    try {
        const data = req.body;
        const result = await CreateProjectPhase(data);

        if (!result) {
            return res.status(400).json({ message: "A problem occurred during the creation of the project phase." });
        }

        return res.status(200).json({ message: "Success", data: result });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

const updateProjectPhase = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await UpdateProject(id, data);
        if (!result) {
            return res
                .status(400)
                .json({ message: "problem occured duriong the update of a project" });
        }
        return res.status(200).json({ message: "sucess", data: result });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
const deleteProjectPhase = async (req, res) => {
    try {
        const id = req?.params?.id;
        const result = await deleteProject(id);

        if (!result) {
            return res
                .status(400)
                .json({ message: "a problem occured during the delete" });
        }
        return res.status(200).json({ message: "sucess", data: result });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
const getPhasesByProjectId = async (req, res) => {
    try {
        const {id}=req.params
        const result = await GetProjectPhaseById(id);
        if (!result) {
            res.status(404).json({ message: "No project phase found" });
        }
        res.status(200).json(result);

    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};




module.exports = {
    createProjectPhase,
    deleteProjectPhase,
    updateProjectPhase,
    getPhasesByProjectId,
};
