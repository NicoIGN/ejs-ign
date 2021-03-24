/* eslint no-param-reassign: [2, { "props": false }] */
// {
const debug = require('debug')('depends');

function enable(object, enabling) {
  debug('enable(', object, enabling, ')');
  if (object != null) {
    object.disabled = (!enabling);
    Array.prototype.forEach.call(object.children, (child) => enable(child, enabling));
  }
}

function activateDependencies(master) {
  debug('in depends.js', master);

  // recherche dans la table des dependances
  const depends = document.querySelectorAll('depends');
  for (let i = 0; i < depends.length; i += 1) {
    if (depends[i].getAttribute('master') === master.id) {
      debug("depends[i]['master'] ", depends[i].getAttribute('master'));
      debug("depends[i]['slave'] ", depends[i].getAttribute('slave'));
      debug('master.checked ', master.checked);

      const asyncElement = document.querySelector(`#${depends[i].getAttribute('slave')}`);
      if (asyncElement === undefined) {
        debug('cannot find slave', depends[i].getAttribute('slave'));
      } else {
        let enabling = true;
        if (master.checked === true) {
          if (depends[i].getAttribute('inverse') === 'true') {
            enabling = false;
          }
        } else if (depends[i].getAttribute('inverse') === 'false') {
          enabling = false;
        }
        debug('asyncElement must be at state', enabling);
        enable(asyncElement, enabling);
      }
    }
  }
}

// eslint-disable-next-line  no-unused-vars
function initializeDependencies() {
  debug('initializeDependencies');
  const depends = document.querySelectorAll('depends');
  for (let i = 0; i < depends.length; i += 1) {
    const asyncElement = document.querySelector(`#${depends[i].getAttribute('master')}`);
    if (asyncElement === undefined || asyncElement === null) {
      debug('cannot find master', depends[i].getAttribute('master'));
    } else {
      activateDependencies(asyncElement);
    }
  }
}
// }

module.exports = {
  initializeDependencies,
  activateDependencies,
};
