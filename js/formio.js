/* eslint no-param-reassign: [2, { "props": false }] */
// {
// eslint-disable-next-line import/no-unresolved
const { dialog } = require('electron').remote;
const fs = require('fs');
const debug = require('debug')('formio');

function regex(pattern, value) {
  const regexp = new RegExp(pattern);
  return regexp.test(value);
}

function validateValue(object) {
  if (object.required && object.value === '') {
    return Boolean(false);
  }
  if (object.hasAttribute('pattern')) {
    return regex(object.pattern, object.value);
  }
  return Boolean(true);
}

function readValue(object, jsonData) {
  let value;
  if (object.tagName.toLowerCase() === 'input') {
    if (object.hasAttribute('type')) {
      const type = object.type.toLowerCase();
      if (type === 'checkbox') {
        value = object.checked;
      } else if (type === 'text') {
        value = object.value;
      } else if (type === 'number') {
        value = object.value;
      } else if (type === 'date') {
        value = object.value;
      } else if (type === 'radio') {
        if (object.checked) value = object.value;
      } else {
        value = object.value;
      }
    }
  } else if (object.tagName.toLowerCase() === 'select') {
    value = object.value;
  }

  if (value !== undefined) jsonData[object.name] = value;

  return jsonData;
}

function append(array1, array2) {
  Object.entries(array2).forEach(([key, value]) => {
    array1[key] = value;
  });

  return array1;
}

function updateValue(object, value) {
  if (object.tagName.toLowerCase() === 'input') {
    if (object.hasAttribute('type')) {
      const type = object.type.toLowerCase();
      if (type === 'checkbox') {
        object.checked = (value === true);
      } else if (type === 'text') {
        object.value = value;
      } else if (type === 'radio') {
        const radioBtn = document.getElementById(value);
        radioBtn.checked = true;
      } else {
        object.value = value;
      }
    }
  } else if (object.tagName.toLowerCase() === 'select') {
    object.value = value;
  }
}

function retrieveParameters(myForm) {
  let jsonData = {};

  const inputs = myForm.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i += 1) {
    if (!inputs[i].disabled) {
      if (inputs[i].hasAttribute('name')) {
        if (!validateValue(inputs[i])) {
          dialog.showErrorBox('Error', `valeur invalide pour le champ ${inputs[i].name}`);
          throw new Error(`invalid value for field ${inputs[i].name}`);
        }
        jsonData = readValue(inputs[i], jsonData);
      }
    }
  }

  const selects = myForm.querySelectorAll('select');
  for (let i = 0; i < selects.length; i += 1) {
    if (!selects[i].disabled) {
      if (selects[i].hasAttribute('name')) {
        if (!validateValue(selects[i])) {
          dialog.showErrorBox('Error', `valeur invalide pour le champ ${selects[i].name}`);
          throw new Error(`invalid value for field ${selects[i].name}`);
        }
        jsonData = readValue(selects[i], jsonData);
      }
    }
  }

  return jsonData;
}

function saveParameters(parameters, filename) {
  const jsonParams = {};
  jsonParams.param = parameters;
  // eslint-disable-next-line  no-console
  console.log('save ', parameters, 'in ', filename);

  try {
    fs.writeFileSync(filename, JSON.stringify(jsonParams, null, '\t'), 'utf-8');
  } catch (e) {
    debug('cannot save file ', filename, e);
    dialog.showErrorBox('Error', `cannot save file ${filename} ${e}`);
  }
}

// }

module.exports = {
  retrieveParameters,
  saveParameters,
  append,
  updateValue,
};
