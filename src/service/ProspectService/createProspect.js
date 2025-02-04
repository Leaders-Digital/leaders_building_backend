const Prospect = require("../../Models/Prospect");
const {
  validateRequiredFields,
  validateSource,
  validatePropertyType,
} = require("../../Validators/validatorsService");

const createProspectt = async (data) => {
  const {
    name,
    lastName,
    telephone,
    email,
    adress,
    dateDeNaissance,
    cin,
    stage,
    status,
    propertyType,
    propertyDetails,
    projectType,
    source,
    agence,
    socialMedia,
    otherSourceDescription,
    service,
    profilePicId,
  } = data;

  validateRequiredFields(data);
  const existPros = await Prospect.findOne({ email: email });
  if (existPros) {
    throw new Error("This email already exists");
  }
  validateSource(source, data);
  validatePropertyType(propertyType);

  if (propertyType === "RDC" && !propertyDetails.rooms) {
    return res.status(400).json({ message: "RDC mut have rooms " });
  }
  if (propertyType === "R+N" && !Array.isArray(propertyDetails.floors)) {
    return res.status(400).json({ message: "must have floors and rooms" });
  }

  const newprospect = new Prospect({
    name,
    lastName,
    telephone,
    email,
    adress,
    dateDeNaissance,
    CIN: cin,
    stage,
    status,
    projectType,
    propertyDetails,
    source,
    agence: source === "Agence" ? agence : {},
    socialMedia: source === "Social Media" ? socialMedia : {},
    otherSourceDescription: source === "Other" ? otherSourceDescription : null,
    service: service,
    profilePicId: profilePicId,
  });
  //newprospect.statusHistory.push({ stage: stage, status: status });
  await newprospect.save();
  return newprospect;
};
module.exports = { createProspectt };
