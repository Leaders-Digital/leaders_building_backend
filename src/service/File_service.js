const File = require("../Models/File");

const AddFile = async (refId, name, FilePath) => {
  const file = await File.create({
    refId,
    name,
    FilePath,
  });
  return file;
};

module.exports = AddFile;
