const _ = require('lodash');

function sortDeep(object) {
  if (Array.isArray(object)) {
    return object.sort();
  }

  return Object.keys(object)
    .sort()
    .reduce((acc, key) => {
      const value = object[key];
      acc[key] = (typeof value === 'object' && value !== null) ? sortDeep(value) : value;
      return acc;
    }, {});
}

function mergeDeep(template, source, dest = _.cloneDeep(template)) {
  [...new Set(Object.keys(dest).concat(Object.keys(source)))].forEach(key => {
    const value = source[key];
    if (value === undefined) {
      delete dest[key];
      return;
    }

    if (typeof value === 'object' && dest[key]) {
      dest[key] = mergeDeep(undefined, value, dest[key]);
      return;
    }

    dest[key] = value;
  });
  return dest;
}

function createGenerator(env) {
  return class JsonAppGenerator extends env.requireGenerator() {
    constructor(args, options) {
      super(args, options);
      this.checkEnvironmentVersion('2.10.2');

      this.jsonsToFormat = {};
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
      return {
        arg(arg) {
          if (!arg) {
            return;
          }

          this._formatJson(arg);
        }
      };
    }

    get default() {
      return {};
    }

    get writing() {
      return {
        formatJsons() {
          Object.keys(this.jsonsToFormat).forEach(filename => {
            let json = this.readDestinationJSON(filename);
            if (!json && !this.options.empty) {
              return;
            }

            json = json || {};
            const options = this.jsonsToFormat[filename] || {};
            if (options.sort) {
              json = sortDeep(json);
            }

            if (options.structure) {
              json = mergeDeep(options.structure, json);
            }

            this.writeDestinationJSON(filename, json);
          });
        }
      };
    }

    get install() {
      return {};
    }

    get end() {
      return {};
    }

    _formatJson(filename, structure) {
      if (!structure && !this.options.empty) {
        throw new Error(`Nothing to do with ${filename}`);
      }

      if (this.jsonsToFormat[filename]) {
        this.debug(`Overriding json structure for ${filename}`);
      }

      this.jsonsToFormat[filename] = structure;
    }

    '#format'(filename, structure) {
      this._formatJson(filename, structure);
    }
  };
}

module.exports = {
  createGenerator
};
