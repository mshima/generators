function createGenerator() {
  return class AppGenerator extends require('@mshima/yeoman-generator-defaults') {
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
        },
        mainMenu() {
          return this.compose.with('@mshima/menu:app');
        }
      };
    }

    get prompting() {
      return {};
    }

    get configuring() {
      return {};
    }

    get composing() {
      return {
        jsonYoRc() {
          return this.compose.with('@mshima/json:yo-rc');
        },
        licenseApp() {
          return this.compose.with('@mshima/license:app');
        },
        readmeApp() {
          return this.compose.with('@mshima/readme:app');
        },
        packageJsonApp() {
          return this.compose.require('@mshima/package-json:app').then(generatorApi => {
            generatorApi.config.set({skipPackageJsonGeneration: true});
          });
        },
        arg(arg) {
          if (!arg) {
            return;
          }

          return this._createPackage(arg);
        },
        menu(arg) {
          if (arg) {
            return;
          }

          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu('Create new package', () => {
              return this.prompt({
                name: 'name',
                message: 'Package name?'
              }).then(answers => {
                if (answers.name) {
                  return this._createPackage(answers.name);
                }
              });
            });

            generatorApi.registerMenu('Run namespace at each package', () => {
              return this.prompt({
                name: 'namespace',
                validate: answer => {
                  if (this.env.toNamespace(answer) || answer === '') {
                    return true;
                  }

                  return 'Must be a valid namespace';
                },
                message: 'Namespace to run?',
                store: true
              }).then(answers => {
                if (answers.namespace) {
                  return this.compose.with('@mshima/workspaces:workspace#*+runNamespace', {}, answers.namespace);
                }
              });
            });

            generatorApi.registerMenu('Run command at each package', () => {
              return this.prompt({
                name: 'command',
                message: 'Command to run?',
                store: true
              }).then(answers => {
                if (answers.command) {
                  return this.compose.with('@mshima/workspaces:workspace#*').then(composeWith => {
                    composeWith.runCommand(answers.command);
                  });
                }
              });
            });
          });
        }
      };
    }

    get default() {
      return {
        workspaces() {
          return this.compose.with('@mshima/workspaces:workspace#*');
        }
      };
    }

    get writing() {
      return {};
    }

    get postWriting() {
      return {
        packageJson() {
          this.packageJson.merge({
            scripts: {
              test: 'npm run test --workspaces --if-present',
              fix: 'npm run fix --workspaces --if-present'
            }
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

    _createPackage(name) {
      return this.compose.with(`@mshima/workspaces:workspace#${name}`);
    }
  };
}

module.exports = {
  createGenerator
};
