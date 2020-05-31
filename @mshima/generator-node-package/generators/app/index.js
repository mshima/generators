const {install} = require('pkg-install');

function createGenerator(env) {
  return class NodePackageAppGenerator extends require('@mshima/generator') {
    constructor(args, options) {
      super(args, options);
      this.checkEnvironmentVersion('2.10.2');

      const {disableLicense, disableReadme} = this.options;
      this.config.defaults({disableLicense, disableReadme});
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
            // Queue main menu
            return this.compose.with('@mshima/menu:app+showMainMenu');
          }
        }
      };
    }

    get prompting() {
      return {
        enableMocha() {
          if (this.config.get('enableMocha')) {
            return;
          }

          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu('Enable mocha', () => {
              this.config.set('enableMocha', true);
              return this.compose.with('@mshima/mocha:app');
            });
          });
        },
        enableGithub() {
          if (this.config.get('enableGithub')) {
            return;
          }

          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu('Enable github', () => {
              this.config.set('enableGithub', true);
              return this.compose.with('@mshima/github:app');
            });
          });
        },
        enableGenerator() {
          if (this.config.get('enableGenerator')) {
            return;
          }

          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu('Enable generator', () => {
              return this._enableGenerator();
            });
          });
        }
      };
    }

    get configuring() {
      return {
        jsonYoRc() {
          return this.compose.with('@mshima/json:yo-rc');
        },
        packageJsonApp() {
          return this.compose.with('@mshima/package-json:app');
        },
        licenseApp() {
          if (this.config.get('disableLicense')) {
            return;
          }

          return this.compose.with('@mshima/license:app');
        },
        readmeApp() {
          if (this.config.get('disableReadme')) {
            return;
          }

          return this.compose.with('@mshima/readme:app');
        },
        xoApp() {
          return this.compose.with('@mshima/xo:app');
        },
        gitApp() {
          return this.compose.with('@mshima/git:app');
        },
        mochaApp() {
          if (!this.config.get('enableMocha')) {
            return;
          }

          return this.compose.with('@mshima/mocha:app');
        },
        githubApp() {
          if (!this.config.get('enableGithub')) {
            return;
          }

          return this.compose.with('@mshima/github:app');
        },
        generatorApp() {
          if (!this.config.get('enableGenerator')) {
            return;
          }

          return this.compose.with('@mshima/generator:app');
        },
        menu() {
          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu(
              'Override existing files',
              () => {
                const promise = this.compose.with('@mshima/generator:app+override');
                if (this.config.get('enableMocha')) {
                  return this.compose.with('@mshima/mocha:app+override');
                }

                return promise;
              }
            );
          });
        }
      };
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

    _enableGenerator() {
      this.config.set('enableGenerator', true);
      return this.compose.with('@mshima/generator:app');
    }

    '#install'() {
      this.queueTask({
        taskName: `npmInstall ${this.destinationPath()}`,
        queueName: 'end',
        method: () => {
          console.log(`Running install at ${this.destinationRoot()}`);
          return install({}, {stdout: 'pipe', cwd: this.destinationRoot()}).then(result => {
            console.log(result.stdout);
          });
        },
        run: false,
        once: true
      });
    }

    '#enableGenerator'() {
      return this._enableGenerator();
    }
  };
}

module.exports = {
  createGenerator
};
