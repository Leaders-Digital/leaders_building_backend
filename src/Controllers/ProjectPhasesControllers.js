const ProjectPhases = require("../Models/ProjectPhases");
const Project = require("../Models/Project");
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
        
        if (!data.projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await Project.findById(data.projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const result = await CreateProjectPhase(data);

        if (!result) {
            return res.status(400).json({ message: "A problem occurred during the creation of the project phase." });
        }

        project.phases.push(result._id);
        await project.save();

        return res.status(200).json({ message: "Success", data: result });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

const updateProjectPhase = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await UpdateProjectPhase(id, data);
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
        
        const phase = await ProjectPhases.findById(id);
        if (!phase) {
            return res.status(404).json({ message: "Phase not found" });
        }

        const project = await Project.findById(phase.projectId);
        if (project) {
            project.phases = project.phases.filter(phaseId => phaseId.toString() !== id);
            await project.save();
        }

        const result = await ProjectPhases.deleteOne({_id:id});

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
        const {id} = req.params;
        
        const project = await Project.findById(id).populate('phases');
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({ 
            message: "Phases retrieved successfully", 
            data: project.phases 
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

const getAllProjectPhases = async (req, res) => {
    try{
        const Phases = await ProjectPhases.find().populate('projectId', 'name');
        res.status(200).json(Phases);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = {
    createProjectPhase,
    deleteProjectPhase,
    updateProjectPhase,
    getPhasesByProjectId,
    getAllProjectPhases
};
