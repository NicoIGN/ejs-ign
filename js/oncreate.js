{
// eslint-disable-next-line import/no-unresolved
  const ignGpao = require('ejs-electron-ign-gpao');
  // eslint-disable-next-line import/no-unresolved
  const { dialog } = require('electron').remote;
  // eslint-disable-next-line import/no-unresolved
  const ConsoleLogHTML = require('console-log-html');

  // eslint-disable-next-line import/no-dynamic-require
  const formreader = require(`${ignGpao.scriptFolder()}/formio`);

  const fs = require('fs');
  const path = require('path');
  const debug = require('debug')('oncreate');

  let myForm;
  for (let i = 0; i < document.getElementsByTagName('form').length; i += 1) {
    const elem = document.getElementsByTagName('form')[i];
    if (elem.hasAttribute('class') && document.currentScript.hasAttribute('params')) {
      if (elem.getAttribute('class') === document.currentScript.getAttribute('params')) {
        myForm = elem;
      }
    }
  }

  //
  //
  //

  function replaceAll(string, key, value) {
    let oldstring = string;
    let newstring = oldstring.replace(key, value);
    while (newstring !== oldstring) {
      oldstring = newstring;
      newstring = oldstring.replace(key, value);
    }
    return newstring;
  }

  //
  //
  //

  function resolveEnv(genericString, dico) {
    let specificString = genericString;
    Object.keys(dico).forEach((entry) => {
      specificString = replaceAll(specificString, `$${entry}$`, dico[entry]);
      debug('specificString: ', specificString, 'after replaceing: ', entry, 'by', dico[entry]);
    });
    return specificString;
  }

  //
  //
  //

  function execute(command, environmentExec) {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec(command, environmentExec, (error, stdout, stderr) => {
        // eslint-disable-next-line no-console
        console.log(stdout);
        if (error) {
          // eslint-disable-next-line no-console
          console.warn(error);
          reject(new Error(error.message));
        }
        resolve(stdout || stderr);
      });
    });
  }

  //
  //
  //

  async function processExecute(executelist, filename, directory, environmentExec) {
    Array.prototype.slice.call(executelist).reduce(async (previousPromise, item) => {
      await previousPromise;
      return execute(resolveEnv(item.innerHTML, environmentExec.env));
    }, Promise.resolve());
  }

  //
  //
  //

  const onButtonClick = function onButtonClick() {
    if (myForm === undefined) {
      // eslint-disable-next-line no-console
      console.log(dialog.showErrorBox('Error', `impossible to find a form of class ${document.currentScript.getAttribute('params')}`));
    }
    const jsonData = formreader.retrieveParameters(myForm);

    // get post-validation commands
    const commands = document.getElementsByTagName('commands');
    if (commands === undefined) {
    // eslint-disable-next-line no-console
      console.log(dialog.showErrorBox('Error', 'no post-validation commands defined '));
      return;
    }

    let directory = '.';

    // check environment prerequiste
    const environment = commands[0].getElementsByTagName('environment');

    const environmentExec = {};
    environmentExec.env = {};

    Array.prototype.forEach.call(environment, (item) => {
      const name = item.getAttribute('name');
      if (process.env[name] === undefined) {
      // eslint-disable-next-line no-console
        console.log(dialog.showErrorBox('Error', `environment variable ${name} not defined`));
        return;
      }
      debug('set env', name, 'with value', process.env[name]);
      environmentExec.env[name] = process.env[name];

      if (name === commands[0].getAttribute('directory')) {
        debug('update directory from env var: ', name, process.env[name]);
        directory = process.env[name];
      }
    });

    // check resources prerequiste
    const resources = commands[0].getElementsByTagName('resource');

    Array.prototype.forEach.call(resources, (resource) => {
      let resourceFile = resource.innerHTML;
      resourceFile = resolveEnv(resourceFile, environmentExec.env);
      try {
        if (!fs.existsSync(resourceFile)) {
        // file does not exist
        // eslint-disable-next-line no-console
          console.log(dialog.showErrorBox('Error', `resource ${resourceFile} missing`));
          return;
        }
      } catch (err) {
      // file does not exist
      // eslint-disable-next-line no-console
        console.log(dialog.showErrorBox('Exception', err.message));
      }
    });

    if (directory === undefined) {
      // eslint-disable-next-line no-console
      console.log(dialog.showErrorBox('Error', 'undefined directory'));
    }

    const filename = path.join(directory, 'parameters.json');
    environmentExec.env.PARAM = filename;

    formreader.saveParameters(jsonData, filename);

    const consoleItem = document.querySelector('#console');
    if (consoleItem === undefined) {
    // eslint-disable-next-line no-console
      console.log(dialog.showErrorBox('Error', 'no console'));
    }

    ConsoleLogHTML.connect(consoleItem); // Redirect log messages

    const executelist = commands[0].getElementsByTagName('execute');
    const failed = processExecute(executelist, filename, directory, environmentExec);
    if (failed > 0) {
    // eslint-disable-next-line no-console
      console.log(dialog.showErrorBox('Error', 'at least one command has failed. See log for more information'));
    }
  // ConsoleLogHTML.disconnect(); // Stop redirecting
  };

  //
  //
  //

  const asyncBtn = document.querySelector(`#${document.currentScript.getAttribute('name')}`);
  asyncBtn.addEventListener('click', onButtonClick);
}
