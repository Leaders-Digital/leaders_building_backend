const Project = require("../Models/Project");

exports.saveExpoToken = async (req, res) => {
    const {userId,token}=req.body;
    
   if (!clientId || !token) {
       return res.status(400).json({message:'you must provide clientId and token'});
   }
   try{
       const updatedProject= await Project.findOneAndUpdate({clientId: userId},{expoToken:token}, {new:true});
       if(!updatedProject){
           res.status(404).json({message:'Project not found'});
       }
       res.status(200).json(updatedProject);
   }catch (error) {
       res.status(500).json({message:'could not find the project'});
   }

};

