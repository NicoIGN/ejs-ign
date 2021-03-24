const path = require('path');

// eslint-disable-next-line global-require
const check = require('./check/checkIhmSchema');

const viewFolder = function getViewFolder() {
  return path.join(__dirname, '/views');
};

const scriptFolder = function getScriptFolder() {
  return path.join(__dirname, '/js');
};

const validate = function validateSchema(ihmData) {
  return check.validate(ihmData);
};

const analyzeError = function analyze(error, ihmData) {
  return check.analyze(error, ihmData);
};

exports.viewFolder = viewFolder;
exports.scriptFolder = scriptFolder;
exports.validate = validate;
exports.analyzeError = analyzeError;
