const { Validator } = require('jsonschema');
const debug = require('debug')('checkIhmSchema');
// const debug = console.log;

//
//
//

function addsubschemas(v) {
  // schema LineEdit
  const lineeditSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
        required: true,
      },
      Key: {
        type: 'string',
        required: true,
      },
      Value: {
        type: 'string',
        required: true,
      },
      ValueMin: {
        type: 'number|string',
      },
      ValueMax: {
        type: 'number|string',
      },
      DefaultValue: {
        type: 'string',
      },
      ValueType: {
        type: 'string',
        pattern: 'Double|Path|String|Integer',
      },
      ToolTip: {
        type: 'string',
      },
      Type: {
        type: 'string',
        pattern: '^LineEdit$',
        required: true,
      },
    },
  };
  v.addSchema(lineeditSchema, '/LineEdit');

  // schema CheckBox
  const checkboxSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
        required: true,
      },
      Key: {
        type: 'string',
        required: true,
      },
      Value: {
        type: 'boolean',
        required: true,
      },
      DefaultValue: {
        type: 'boolean',
      },
      ValueType: {
        type: 'string',
        pattern: '^Boolean$',
      },
      ToolTip: {
        type: 'string',
      },
      Type: {
        type: 'string',
        pattern: '^CheckBox$',
        required: true,
      },
    },
  };
  v.addSchema(checkboxSchema, '/CheckBox');

  // schema Label
  const labelSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
        required: true,
      },
      Type: {
        type: 'string',
        pattern: '^Label$',
        required: true,
      },
    },
  };
  v.addSchema(labelSchema, '/Label');

  // schema ButtonGroup
  const buttongroupSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
      },
      Key: {
        type: 'string',
        pattern: '^[A-Za-z0-9\\s]+$',
        required: true,
      },
      Type: {
        type: 'string',
        pattern: '^ButtonGroup$',
        required: true,
      },
      GroupType: {
        type: 'string',
        pattern: 'VerticalGroup|HorizontalGroup',
      },
      content: {
        type: 'array',
        required: true,
        items: '/RadioButton',
      },
    },
  };
  v.addSchema(buttongroupSchema, '/ButtonGroup');

  // schema RadioButton
  const radiobuttonSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
        required: true,
      },
      Key: {
        type: 'string',
        required: true,
      },
      Value: {
        type: 'boolean',
        required: true,
      },
      DefaultValue: {
        type: 'boolean',
      },
      ValueType: {
        type: 'string',
        pattern: '^Boolean$',
      },
      ToolTip: {
        type: 'string',
      },
      Type: {
        type: 'string',
        pattern: '^RadioButton$',
        required: true,
      },
    },
  };
  v.addSchema(radiobuttonSchema, '/RadioButton');

  // schema FileSelector
  const fileselectorSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
      },
      Key: {
        type: 'string',
        required: true,
      },
      Value: {
        type: 'string',
      },
      DefaultValue: {
        type: 'string',
      },
      ValueType: {
        type: 'string',
        pattern: '^FilePath$',
      },
      ToolTip: {
        type: 'string',
      },
      Type: {
        type: 'string',
        pattern: '^FileSelector$',
        required: true,
      },
    },
  };
  v.addSchema(fileselectorSchema, '/FileSelector');

  // schema FolderSelector
  const folderselectorSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
      },
      Key: {
        type: 'string',
        required: true,
      },
      Value: {
        type: 'string',
      },
      DefaultValue: {
        type: 'string',
      },
      ValueType: {
        type: 'string',
        pattern: '^Path$',
      },
      ToolTip: {
        type: 'string',
      },
      Type: {
        type: 'string',
        pattern: '^FolderSelector$',
        required: true,
      },
    },
  };
  v.addSchema(folderselectorSchema, '/FolderSelector');

  // schema ComboBox
  const comboboxSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
      },
      Key: {
        type: 'string',
        required: true,
      },
      Value: {
        type: 'string',
      },
      DefaultValue: {
        type: 'string|integer',
      },
      ValueType: {
        type: 'string',
        pattern: '^String$',
      },
      ToolTip: {
        type: 'string',
      },
      Type: {
        type: 'string',
        pattern: '^ComboBox$',
        required: true,
      },
    },
  };
  v.addSchema(comboboxSchema, '/ComboBox');

  // schema Group
  const groupSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
      },
      Key: {
        type: 'string',
      },
      Type: {
        type: 'string',
        pattern: '^Group$',
        required: true,
      },
      GroupType: {
        type: 'string',
        pattern: 'VerticalGroup|HorizontalGroup',
      },
      content: {
        type: 'array',
        items: {
          anyOf: ['/LineEdit', '/Group', '/Label', '/ButtonGroup', '/FolderSelector', '/FileSelector', '/CheckBox', '/ComboBox'],
        },
      },
    },
  };
  v.addSchema(groupSchema, '/Group');

  // schema Page
  const pageSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Name: {
        type: 'string',
      },
      Key: {
        type: 'string',
      },
      Type: {
        type: 'string',
        pattern: '^Page$',
        required: true,
      },
      content: {
        type: 'array',
        required: true,
        items: {
          anyOf: ['/LineEdit', '/Group', '/Label', '/ButtonGroup', '/FolderSelector', '/FileSelector', '/CheckBox', '/ComboBox'],
        },
      },
    },
  };
  v.addSchema(pageSchema, '/Page');

  // schema Dependencies
  const dependencySchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      Master: {
        type: 'string',
        required: true,
      },
      Slave: {
        type: 'string',
        required: true,
      },
      Inverse: {
        type: 'boolean',
      },
      Type: {
        type: 'string',
        pattern: '^Dependency$',
        required: false,
      },
    },
  };
  v.addSchema(dependencySchema, '/Dependency');
  // schema environment
  const envSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: {
        type: 'string',
        required: true,
      },
      value: {
        type: 'string',
        required: true,
      },
    },
  };
  v.addSchema(envSchema, '/Environment');

  // schema command
  const cmdSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      execute: {
        type: 'string',
        required: true,
      },
    },
  };
  v.addSchema(cmdSchema, '/Command');
}

//
//
//

function validate(ihmData) {
  // AB : source => https://www.npmjs.com/package/jsonschema
  const v = new Validator();

  addsubschemas(v);

  // Schema json ihm
  const ihmSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      ihm: {
        type: 'object',
        required: true,
        properties: {
          content: {
            type: 'array',
            required: true,
            items: '/Page',
          },
          dependencies: {
            type: 'array',
            items: '/Dependency',
          },
          oncreate: {
            type: 'object',
            additionalProperties: false,
            properties: {
              prerequisite: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  environment: {
                    type: 'array',
                  },
                  directory: {
                    type: 'string',
                  },
                  resources: {
                    type: 'array',
                  },
                },
              },
              commands: {
                type: 'array',
                items: '/Command',
              },
            },
          },
        },
      },
      page: {
        type: 'string',
        required: true,
      },
      js_folder: {
        type: 'string',
        required: true,
      },
    },
  };
  return v.validate(ihmData, ihmSchema);
}

//
//
//

function analyze(error, data) {
  const messagelist = [];
  const errorpath = error.property.split('.');
  let subdata = data;
  for (let i = 1; i < errorpath.length; i += 1) {
    if (errorpath[i].startsWith('content[')) {
      let pos = errorpath[i].slice(8);
      [pos] = pos.split(']');
      subdata = subdata.content[[pos][0]];
    } else if ({}.hasOwnProperty.call(subdata, errorpath[i])) {
      subdata = subdata[errorpath[i]];
    } else {
      const str = `no attribute '${errorpath[i]}' in object ${JSON.stringify(subdata, null, '\t')}`;
      messagelist.push(str);
      return messagelist;
    }
  }
  debug('errorpath', errorpath, errorpath.length);

  if (errorpath.length > 1) {
    const v = new Validator();
    addsubschemas(v);
    if ({}.hasOwnProperty.call(subdata, 'content')) {
      Array.prototype.forEach.call(subdata.content, (content) => {
        // trying to guess type of object
        if ({}.hasOwnProperty.call(content, 'Type')) {
          const subschema = `/${content.Type}`;
          if ({}.hasOwnProperty.call(v.schemas, subschema)) {
            debug('validate subdata.content', content);

            const subresult = v.validate(content, v.schemas[subschema]);
            if (subresult.errors.length > 0) debug('subresult against', subschema, 'is', subresult);

            Array.prototype.forEach.call(subresult.errors, (suberror) => {
              debug(' --> analyze ', content, 'against', subschema, suberror.message);

              const submessagelist = analyze(suberror, content);
              Array.prototype.forEach.call(submessagelist, (submessage) => {
                if (submessage !== undefined) {
                  debug('submessage for', content, 'is:', submessage);
                  messagelist.push(submessage);
                }
              });
            });
          } else {
            const str = `no subschema ${subschema} in schema validation`;
            messagelist.push(str);
          }
        } else {
          const str = `no attribute Type in sub object${JSON.stringify(content, null, '\t')}`;
          messagelist.push(str);
        }
      });
    } else {
      debug('add error message (1)', error.message, 'in', subdata);
      messagelist.push(`${error.message} ${JSON.stringify(data)}`);
    }
  } else {
    debug('add error message (2)', error.message, 'in', data);
    messagelist.push(`${error.message} ${JSON.stringify(data)}`);
  }
  return messagelist;
}

//
//
//

module.exports = {
  validate,
  analyze,
};
