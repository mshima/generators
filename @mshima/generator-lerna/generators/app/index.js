function createGenerator(env) {
  return class AppGenerator extends env.requireGenerator() {
    constructor(args, options) {
      super(args, options);
      this.checkEnvironmentVersion('2.10.2');
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
          if (this.env._rootGenerator === this) {
            return this.compose.with('@mshima/menu:app+showMainMenu');
          }
        }
      };
    }

    get prompting() {
      return {};
    }

    get configuring() {
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
            generatorApi.addDevDependency('lerna', '^3.20.2');
            generatorApi.addScript({
              test: 'lerna run test',
              fix: 'lerna run fix'
            });
          });
        },
        gitApp() {
          return this.compose.require('@mshima/git:app').then(generatorApi => {
            generatorApi.ignore(
              '# Added by @mshima/generator-lerna',
              'lerna-debug.log'
            );
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
                  return this.compose.with('@mshima/lerna:package#*+runNamespace', {}, answers.namespace);
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
                  return this.compose.with('@mshima/lerna:package#*').then(composeWith => {
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
        lernaPackage() {
          return this.compose.with('@mshima/lerna:package#*');
        }
      };
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

    _createPackage(name) {
      return this.compose.with(`@mshima/lerna:package#${name}`);
    }
  };
}

module.exports = {
  createGenerator
};
