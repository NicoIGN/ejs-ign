/* eslint no-param-reassign: [2, { "props": false }] */

{
// eslint-disable-next-line import/no-unresolved
  const { dialog, currentWindow } = require('electron').remote;
  const debug = require('debug')('fileloader');
  const fs = require('fs');

  // eslint-disable-next-line import/no-unresolved
  const ignGpao = require('ejs-ign');
  // eslint-disable-next-line import/no-dynamic-require
  const depends = require(`${ignGpao.scriptFolder()}/depends`);

  const asyncBtn = document.querySelector(`#${document.currentScript.getAttribute('name')}`);
  let myForm;

  for (let i = 0; i < document.getElementsByTagName('form').length; i += 1) {
    const elem = document.getElementsByTagName('form')[i];
    if (elem.hasAttribute('class')) {
      if (elem.getAttribute('class') === document.currentScript.getAttribute('params')) {
        myForm = elem;
      }
    }
  }
  if (myForm === undefined) {
    dialog.showErrorBox('Oops! Something went wrong!', 'Help us improve your experience by sending an error report');
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

  function append(array1, array2) {
    const keys = Object.keys(array2);
    const values = Object.values(array2);
    for (let i = 0; i < keys.length; i += 1) {
      array1[keys[i]] = values[i];
    }
  }

  const onButtonClick = function onButtonClick() {
    const dialogOptions = {
      title: 'charger les parametres',
      buttonLabel: 'charger',
      properties: ['openFile'],
      filters: [{ name: 'Json file', extensions: ['json'] }],
    };

    dialog.showOpenDialog(currentWindow, dialogOptions).then((result) => {
      if (!result.canceled) {
        let jsonData = {};
        debug('filepath: ', result.filePaths[0]);
        const data = fs.readFileSync(result.filePaths[0]);

        const obj = JSON.parse(data);
        if (!Object.prototype.hasOwnProperty.call(obj, 'param')) {
          dialog.showErrorBox('error', 'not a parameters file');
        }
        jsonData = obj.param;

        const inputs = myForm.querySelectorAll('input');
        append(inputs, myForm.querySelectorAll('select'));
        debug('number of inputs:', inputs.length);
        for (let i = 0; i < inputs.length; i += 1) {
          if (inputs[i].hasAttribute('name')) {
            const key = inputs[i].getAttribute('name');
            if (key === undefined) dialog.showErrorBox('error', 'undefined key', 'name on', inputs[i]);

            // eslint-disable-next-line max-len
            if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
              updateValue(inputs[i], jsonData[key]);
            } else {
              debug('no value for key:', key, 'in dictionary', JSON.stringify(jsonData, null, '\t'));
            }
          }
        }
        depends.initializeDependencies();
      }
    }).catch((err) => {
      dialog.showErrorBox('Oops! Something went wrong!', err.message);
    });
  };

  asyncBtn.addEventListener('click', onButtonClick);
}
