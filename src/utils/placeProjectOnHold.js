const ProjectHold = require("../Models/ProjectHold");
const Project = require("../Models/Project");

const shiftDate = (date, days) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid date: ${date}`);
    }
    return new Date(dateObj.getTime() + days * 24 * 60 * 60 * 1000);
};
const formatDateToString = (date) => {
    return date.toISOString().split('T')[0];
};

async function createPauseRecord(projectId) {
    try {
        await ProjectHold.create({
            projectId,
            holdStartDate: new Date(),
        });
    } catch (error) {
        throw new Error(`Failed to create pause record: ${error.message}`);
    }
}

async function resumeProjectAndShiftDates(projectId) {
    try {
        const hold = await ProjectHold.findOneAndUpdate(
            { projectId, holdEndDate: null },
            { holdEndDate: new Date() },
            { new: true }
        );
        if (!hold) throw new Error("No open pause to resume");

        const holdDuration = Math.ceil((hold.holdEndDate - hold.holdStartDate) / (24 * 60 * 60 * 1000));
        


        const project = await Project.findById(projectId).populate("phases");
        if (!project) throw new Error("Project not found");

        const numberOfPhases = project.phases.length;
        const projectEndShift = holdDuration * numberOfPhases;
        

        if (project.dateEnd) {
            const originalEndDate = project.dateEnd;
            const newEndDate = shiftDate(project.dateEnd, projectEndShift);
            
            console.log(`Project end date shifted from ${originalEndDate} to ${newEndDate}`);
            
            await Project.findByIdAndUpdate(projectId, { dateEnd: newEndDate });
        }

        for (const phase of project.phases) {
            if (phase.finishDate) {
                const originalFinishDate = phase.finishDate;
                const newFinishDate = shiftDate(phase.finishDate, holdDuration);
                phase.finishDate = formatDateToString(newFinishDate);
                console.log(`Phase ${phase.name} finish date shifted from ${originalFinishDate} to ${phase.finishDate} (+${holdDuration} days)`);
            }

            if (Array.isArray(phase.subphases)) {
                phase.subphases = phase.subphases.map(sub => {
                    const subObj = sub.toObject ? sub.toObject() : sub;
                    const updatedSub = { ...subObj };
                    
                    if (subObj.finishDate) {
                        const originalFinishDate = subObj.finishDate;
                        const newFinishDate = shiftDate(subObj.finishDate, holdDuration);
                        updatedSub.finishDate = formatDateToString(newFinishDate);
                        console.log(`Subphase ${subObj.name} finish date shifted from ${originalFinishDate} to ${updatedSub.finishDate} (+${holdDuration} days)`);
                    }
                    
                    return updatedSub;
                });
            }
            
            phase.markModified('subphases');
            await phase.save();
        }

        const updatedProject = await Project.findById(projectId).populate("phases");
        console.log(`Final project end date: ${updatedProject.dateEnd}`);
        
        return {
            message: "Project resumed successfully",
            holdDuration,
            numberOfPhases,
            projectEndShift,
            project: updatedProject
        };
    } catch (error) {
        throw new Error(`Failed to resume project: ${error.message}`);
    }
}

module.exports = {
    createPauseRecord,
    resumeProjectAndShiftDates,
};
