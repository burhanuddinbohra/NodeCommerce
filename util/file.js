const fs = require("fs");

const deleteFile = (filepPath) => {
  fs.unlink(filepPath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
