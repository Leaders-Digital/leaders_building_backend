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
    whatsapp,
    adress,
    dateDeNaissance,
    cin,
    situation,
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
    // Nouveaux champs détails du projet
    localisationProjet,
    terrainInclus,
    superficieTerrain,
    surfaceBatie,
    contraintesLegales,
    detailsContraintes,
    // Nouveaux champs budget et financement
    budgetEstime,
    modeFinancement,
    prioriteQualitePrix,
    // Nouveaux champs délais et planning
    debutTravaux,
    dateLimiteLivraison,
    flexibiliteDelais,
    travauxPlusieursPhases,
    // Anciens champs localisation
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
    throw new Error("RDC must have rooms");
  }
  if (propertyType === "R+N" && !Array.isArray(propertyDetails.floors)) {
    throw new Error("R+N must have floors and rooms");
  }

  console.log("lotissement", lotissement);
  console.log("lotisscords", lotissementCords);

  const newprospect = new Prospect({
    name,
    lastName,
    telephone,
    email,
    whatsapp,
    adresse: adress,
    situation,
    dateDeNaissance,
    CIN: cin,
    status,
    projectType,
    propertyDetails,
    propertyType,
    service,

    localisationProjet,
    terrainInclus,
    superficieTerrain: parseInt(superficieTerrain),
    surfaceBatie: parseInt(surfaceBatie),
    contraintesLegales,
    detailsContraintes: contraintesLegales === "oui" ? detailsContraintes : null,

    budgetEstime: parseInt(budgetEstime),
    modeFinancement,
    prioriteQualitePrix,

    debutTravaux: new Date(debutTravaux),
    dateLimiteLivraison: new Date(dateLimiteLivraison),
    flexibiliteDelais,
    travauxPlusieursPhases,

    source,
    agence: source === "agence" ? agence : {},
    socialMedia: source === "rs" ? socialMedia : {},
    otherSourceDescription: source === "autre" ? otherSourceDescription :
        source === "Site Web" ? "Site web" : null,

    profilePicId: profilePicId,
    percent,
    agent,

    lotissement,
    lotissementCords: lotissement === "Lotissement" ? lotissementCords : {},
    adressParticulier,

    prospectType: "standard",
  });

  await newprospect.save();
  return newprospect;
};

module.exports = { createProspectt };