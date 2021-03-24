{
  // eslint-disable-next-line import/no-unresolved
  const ignGpao = require('ejs-ign');
  // eslint-disable-next-line import/no-unresolved
  const { dialog } = require('electron').remote;

  const { ipcRenderer } = require('electron');

  // eslint-disable-next-line import/no-dynamic-require
  const util = require(`${ignGpao.scriptFolder()}/util`);

  let myForm;

  for (let i = 0; i < document.getElementsByTagName('form').length; i += 1) {
    const elem = document.getElementsByTagName('form')[i];
    if (elem.hasAttribute('class')) {
      if (elem.getAttribute('class') === 'gpao-params') {
        myForm = elem;
      }
    }
  }
  if (myForm === undefined) {
    dialog.showErrorBox('Oops! Something went wrong!', 'Impossible to retrieve the form');
  }

  ipcRenderer.on('setparameters', (event, parameters) => {
    // eslint-disable-next-line  no-console
    console.log(String(parameters));
    util.updateInterface(parameters, myForm);
  });
}
