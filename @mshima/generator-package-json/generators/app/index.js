const path = require('path');

const BASE_STRUCTURE = {
  sort: false,
  structure: {
    name: undefined,
    version: undefined,
    description: undefined,
    keywords: undefined,
    homepage: undefined,
    private: undefined,
    license: undefined,
    author: {
      name: undefined,
      email: undefined,
      url: undefined
    },
    files: undefined,
    main: undefined,
    repository: {
      type: undefined,
      url: undefined
    },
    dependencies: {},
    optionalDependencies: {},
    peerDependencies: {},
    devDependencies: {},
    scripts: {}
  }
};

function createGenerator(env) {
  return class PackageJsonGenerator extends env.requireGenerator('@mshima/json:app') {
    constructor(args, options, features) {
      super(args, options, features);

      this.checkEnvironmentVersion('3.3.0');

      this.packageJsonPath = this.destinationPath('package.json');
      this.packageJsonConfig = this.createStorage(this.packageJsonPath);
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
        },
        authorApp() {
          return this.compose.with('@mshima/author:app');
        },
        licenseApp() {
          return this.compose.with('@mshima/license:app');
        }
      };
    }

    get prompting() {
      return {
        prompts() {
          return this.prompt([
            {
              name: 'scope',
              message: 'Do you want to set a scope?'
            },
            {
              name: 'name',
              message: 'What the module name?',
              default: () => path.basename(this.destinationRoot())
            },
            {
              name: 'description',
              message: 'Description'
            },
            {
              name: 'homepage',
              message: 'Project homepage url'
            },
            {
              name: 'keywords',
              message: 'Package keywords (comma to split)',
              filter(words) {
                if (!words) {
                  return null;
                }

                return words.split(/\s*,\s*/g);
              }
            }
          ], this.config);
        }
      };
    }

    get configuring() {
      return {};
    }

    get default() {
      return {
        packageJson() {
          if (this.config.get('skipPackageJsonGeneration')) {
            return;
          }

          this.packageJsonConfig.defaults({version: '0.0.0'});

          const scope = this.config.get('scope');
          const name = this.config.get('name');
          const packageName = scope ? `@${scope}/${name}` : name;
          this.packageJsonConfig.set('name', packageName);
          ['description', 'homepage', 'keywords'].forEach(prop => {
            const value = this.config.getPath(prop);
            if (value === undefined || value === null || value === '') {
              return;
            }

            this.packageJsonConfig.setPath(prop, value);
          });

          if (this.compose.api.author) {
            ['name', 'email', 'url'].forEach(prop => {
              const value = this.compose.api.author.config.getPath(prop);
              if (value === undefined || value === null || value === '') {
                return;
              }

              this.packageJsonConfig.setPath(`author.${prop}`, value);
            });
          }

          if (this.compose.api.license) {
            const value = this.compose.api.license.config.getPath('license');
            if (value === undefined || value === null || value === '') {
              return;
            }

            this.packageJsonConfig.setPath('license', value);
          }
        },
        composing() {
          this._formatJson('package.json', BASE_STRUCTURE);
        }
      };
    }

    get writing() {
      return super.writing;
    }

    get install() {
      return {};
    }

    get end() {
      return {};
    }

    get composeApi() {
      return {
        addPeerDependency(packageName, version) {
          this._addToObject('peerDependencies', packageName, version);
        },
        getScope() {
          return this.config.get('scope');
        }
      };
    }

    _addToObject(name, key, value) {
      if (value) {
        this.packageJsonConfig.setPath(`${name}.${key}`, value);
      } else {
        const keyStorage = this.packageJsonConfig.createStorage(name);
        keyStorage.set(key);
      }
    }

    _addToArray(key, value) {
      value = Array.isArray(value) ? value : [value];
      let values = this.packageJsonConfig.getPath(key);
      if (values) {
        values = [...new Set(values.concat(value))];
      } else {
        values = value;
      }

      this.packageJsonConfig.setPath(key, values);
    }
  };
}

module.exports = {
  createGenerator
};
