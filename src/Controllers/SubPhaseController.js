const ProjectPhases = require("../Models/ProjectPhases");
const Project = require("../Models/Project");

const createSubPhase = async (req, res) => {
  try {
    const { phaseId, subPhaseData } = req.body;
    
    if (!phaseId) {
      return res.status(400).json({ message: "Phase ID is required" });
    }

    const phase = await ProjectPhases.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    phase.subphases.push(subPhaseData);
    await phase.save();

    return res.status(201).json({ 
      message: "SubPhase created successfully", 
      data: phase 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateSubPhase = async (req, res) => {
  try {
    const { phaseId, subPhaseId, subPhaseData } = req.body;
    
    if (!phaseId || !subPhaseId) {
      return res.status(400).json({ message: "Phase ID and SubPhase ID are required" });
    }

    const phase = await ProjectPhases.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    // Find and update the specific subphase
    const subPhaseIndex = phase.subphases.findIndex(
      sub => sub._id.toString() === subPhaseId
    );

    if (subPhaseIndex === -1) {
      return res.status(404).json({ message: "SubPhase not found" });
    }

    // Update the subphase
    phase.subphases[subPhaseIndex] = {
      ...phase.subphases[subPhaseIndex].toObject(),
      ...subPhaseData
    };

    await phase.save();

    return res.status(200).json({ 
      message: "SubPhase updated successfully", 
      data: phase 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteSubPhase = async (req, res) => {
  try {
    const { phaseId, subPhaseId } = req.params;
    
    if (!phaseId || !subPhaseId) {
      return res.status(400).json({ message: "Phase ID and SubPhase ID are required" });
    }

    const phase = await ProjectPhases.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    // Remove the subphase
    phase.subphases = phase.subphases.filter(
      sub => sub._id.toString() !== subPhaseId
    );

    await phase.save();

    return res.status(200).json({ 
      message: "SubPhase deleted successfully", 
      data: phase 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getSubPhaseById = async (req, res) => {
  try {
    const { phaseId, subPhaseId } = req.params;
    
    if (!phaseId || !subPhaseId) {
      return res.status(400).json({ message: "Phase ID and SubPhase ID are required" });
    }

    const phase = await ProjectPhases.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    const subPhase = phase.subphases.find(
      sub => sub._id.toString() === subPhaseId
    );

    if (!subPhase) {
      return res.status(404).json({ message: "SubPhase not found" });
    }

    return res.status(200).json({ 
      message: "SubPhase retrieved successfully", 
      data: subPhase 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllSubPhasesByPhaseId = async (req, res) => {
  try {
    const { phaseId } = req.params;
    
    if (!phaseId) {
      return res.status(400).json({ message: "Phase ID is required" });
    }

    const phase = await ProjectPhases.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }

    return res.status(200).json({ 
      message: "SubPhases retrieved successfully", 
      data: phase.subphases 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllSubPhasesByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findById(projectId).populate('phases');
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get all subphases from all phases of the project
    const allSubPhases = [];
    project.phases.forEach(phase => {
      if (phase.subphases && phase.subphases.length > 0) {
        phase.subphases.forEach(subPhase => {
          allSubPhases.push({
            ...subPhase.toObject(),
            phaseId: phase._id,
            phaseName: phase.name
          });
        });
      }
    });

    return res.status(200).json({ 
      message: "All SubPhases retrieved successfully", 
      data: allSubPhases 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  createSubPhase,
  updateSubPhase,
  deleteSubPhase,
  getSubPhaseById,
  getAllSubPhasesByPhaseId,
  getAllSubPhasesByProjectId,
}; 