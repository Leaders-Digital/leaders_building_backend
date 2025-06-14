const validateRequiredFields = (data) => {
  const { name, lastName, telephone, email, status } = data;
  if (!name || !lastName || !telephone || !email || !status) {
    throw new Error("One of the required fields is missing");
  }
};

const validateSource = (source, data) => {
  const allowedSources = ["agence", "rs", "Other"];
  if (!allowedSources.includes(source)) {
    throw new Error("Source is not valid");
  }
  if (source === "agence") {
    if (!data.agence || !data?.agence?.name || !data?.agence?.agent) {
      throw new Error("Agence source must have a name and an agent.");
    }
  }

  if (source === "rs") {
    if (
      !data?.socialMedia ||
      !data?.socialMedia?.platform ||
      !data?.socialMedia?.link
    ) {
      throw new Error("Social Media source must have platform and link.");
    }
  }

  if (source === "Other" && !data.otherSourceDescription) {
    throw new Error("A description is required for 'Other' source.");
  }
};

const validatePropertyType = (propertyType) => {
  const allowedPropertyTypes = ["RDC", "R+N", "Autre"];
  if (!allowedPropertyTypes.includes(propertyType)) {
    throw new Error("Property type is invalid");
  }
};

module.exports = {
  validateRequiredFields,
  validateSource,
  validatePropertyType,
};
