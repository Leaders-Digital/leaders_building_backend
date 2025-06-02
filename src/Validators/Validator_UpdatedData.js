const validateUpdateData = (data) => {
  if (data._id) {
    throw new Error("_id field cannot be updated");
  }
  if (data.isDeleted !== undefined) {
    throw new Error("isDeleted filed cannot be modified");
  }
};
module.exports = validateUpdateData;
