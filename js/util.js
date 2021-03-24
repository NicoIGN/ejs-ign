/* eslint no-param-reassign: [2, { "props": false }] */

// {
// eslint-disable-next-line import/no-unresolved
const { dialog } = require('electron').remote;
const debug = require('debug')('fileloader');
const fs = require('fs');

// eslint-disable-next-line import/no-unresolved
const ignGpao = require('ejs-ign');
// eslint-disable-next-line import/no-dynamic-require
const formio = require(`${ignGpao.scriptFolder()}/formio`);
// eslint-disable-next-line import/no-dynamic-require
const depends = require(`${ignGpao.scriptFolder()}/depends`);

function updateInterface(filename, form) {
  let jsonData = {};
  const data = fs.readFileSync(filename);

  const obj = JSON.parse(data);
  if (!Object.prototype.hasOwnProperty.call(obj, 'param')) {
    dialog.showErrorBox('error', 'not a parameters file');
  }
  jsonData = obj.param;
  const myForm = form;

  const inputs = myForm.querySelectorAll('input');
  formio.append(inputs, myForm.querySelectorAll('select'));
  debug('number of inputs:', inputs.length);
  for (let i = 0; i < inputs.length; i += 1) {
    if (inputs[i].hasAttribute('name')) {
      const key = inputs[i].getAttribute('name');
      if (key === undefined) dialog.showErrorBox('error', 'undefined key', 'name on', inputs[i]);

      // eslint-disable-next-line max-len
      if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
        formio.updateValue(inputs[i], jsonData[key]);
      } else {
        debug('no value for key:', key, 'in dictionary', JSON.stringify(jsonData, null, '\t'));
      }
    }
  }
  depends.initializeDependencies();
}
// }

module.exports = {
  updateInterface,
};
