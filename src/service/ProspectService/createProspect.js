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
    percent,
    lotissement,
    lotissementCords,
    adressParticulier,
    agent,
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
  console.log("lotissment", lotissement);
  console.log("lotisscords", lotissementCords);
  const newprospect = new Prospect({
    name,
    lastName,
    telephone,
    email,
    adresse: adress,
    dateDeNaissance,
    CIN: cin,
    status,
    projectType,
    propertyDetails,
    source,
    agence: source === "agence" ? agence : {},
    socialMedia: source === "rs" ? socialMedia : {},
    otherSourceDescription: source === "Other" ? otherSourceDescription : null,
    service: service,
    profilePicId: profilePicId,
    percent,
    lotissement,
    lotissementCords: lotissement === "Lotissement" ? lotissementCords : {},
    adressParticulier,
    propertyType,
    agent,
  });
  //newprospect.statusHistory.push({ stage: stage, status: status });
  await newprospect.save();
  return newprospect;
};
module.exports = { createProspectt };
