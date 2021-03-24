{
  const { debug } = require('debug')('fileselector');

  // eslint-disable-next-line import/no-unresolved
  const { dialog, currentWindow } = require('electron').remote;

  const myName = document.currentScript.getAttribute('name');

  const asyncBtn = document.querySelector(`#${myName}`);
  const replyField = document.querySelector(`#file-selector-content-${myName}`);
  const onButtonClick = function onButtonClick() {
    const dialogOptions = {
      title: 'Choisir un fichier:',
      properties: ['openFile'],
    };
    dialog.showOpenDialog(currentWindow, dialogOptions).then((result) => {
      if (!result.canceled) {
        [replyField.value] = result.filePaths;
      }
    }).catch((err) => {
      debug(err);
    });
  };
  asyncBtn.addEventListener('click', onButtonClick);
}
