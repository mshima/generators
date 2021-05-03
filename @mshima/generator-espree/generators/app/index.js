const espree = require('espree');

const log = (node, arg, propetyNameOrType) => {
  console.log('=================================');
  console.log(arg);
  console.log(propetyNameOrType);
  console.log(node);
  return Promise.resolve(node);
};

const findNode = function (node, propetyNameOrType, nameOrLog, equalsValue) {
  let value;
  if (Array.isArray(propetyNameOrType)) {
    const arg = propetyNameOrType.shift();
    this._debug(`array: ${arg}`);
    let promise;
    if (arg === true) {
      promise = log(node, 'logging step', propetyNameOrType);
    } else if (typeof arg === 'function') {
      promise = Promise.resolve(arg(node));
    } else if (Array.isArray(arg)) {
      promise = findNode.call(this, node, ...arg);
    } else {
      promise = findNode.call(this, node, arg);
    }

    if (nameOrLog) {
      promise = promise.then(node => log(node, arg, propetyNameOrType));
    }

    if (propetyNameOrType.length === 0) {
      this._debug('done');
      return promise;
    }

    return promise.then(node => {
      this._debug('continue');
      return findNode.call(this, node, propetyNameOrType, nameOrLog);
    });
  }

  this._debug(`looking for ${propetyNameOrType} at ${node}`);
  if (Array.isArray(node)) {
    this._debug('Node is array');
    if (propetyNameOrType !== undefined) {
      value = this._.get(node, propetyNameOrType);
    }

    if (!value) {
      if (propetyNameOrType === undefined) {
        this._debug(`Looking for item where ${nameOrLog} equals ${equalsValue}`);
      } else {
        this._debug(`Looking for item where type equals ${propetyNameOrType}`);
      }

      value = node.find(value => {
        if (propetyNameOrType !== undefined) {
          const isType = value.type === propetyNameOrType;
          if (!nameOrLog) {
            return isType;
          }
        }

        return (equalsValue !== undefined && this._.get(value, nameOrLog) === equalsValue) || (value.id && value.id.name === nameOrLog) || (value.key && value.key.name === nameOrLog);
      });
    }
  } else {
    this._debug('Node is not array');
    value = this._.get(node, propetyNameOrType);

    if (value !== undefined) {
      this._debug(`Found property ${propetyNameOrType}`);
      if (Array.isArray(value) && equalsValue !== undefined && nameOrLog !== undefined) {
        this._debug(`Looking for item where ${nameOrLog} equals ${equalsValue}`);
        value = value.find(value => {
          return this._.get(value, nameOrLog) === equalsValue;
        });
      }
    }
  }

  if (value) {
    this._debug('Found value');
    return Promise.resolve(value);
  }

  this._debug('Not found');
  return Promise.reject(node);
};

function createGenerator() {
  return class EspreeAppGenerator extends require('@mshima/yeoman-generator-defaults') {
    constructor(args, options, features) {
      super(args, options, features);
      this.checkEnvironmentVersion('3.3.0');
    }

    get initializing() {
      return {
        composeContext() {
          if (this.compose) {
            return;
          }

          if (this.env._rootGenerator && this.env._rootGenerator !== this) {
            throw new Error(`Generator ${this.options.namespace} requires experimental composing enabled`);
          }

          this.compose = this.env.createCompose(this.destinationRoot());
        }
      };
    }

    get prompting() {
      return {};
    }

    get configuring() {
      return {};
    }

    get default() {
      return {};
    }

    get writing() {
      return {};
    }

    get install() {
      return {};
    }

    get end() {
      return {};
    }

    _parseScript(source) {
      return espree.parse(source, {range: true, ecmaVersion: 10});
    }

    _findNode(parsed, spec, log) {
      return findNode.call(this, parsed, spec, log);
    }
  };
}

module.exports = {
  createGenerator
};
