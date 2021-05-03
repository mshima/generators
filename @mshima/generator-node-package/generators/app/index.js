const {install} = require('pkg-install');

function createGenerator() {
  return class NodePackageAppGenerator extends require('@mshima/yeoman-generator-defaults') {
    constructor(args, options, features) {
      super(args, options, features);
      this.checkEnvironmentVersion('3.3.0');

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
          return this.compose.with('@mshima/menu:app');
        }
      };
    }

    get prompting() {
      return {
        enableGit() {
          if (this.storage.enableGit) {
            return;
          }

          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu('Enable git', () => {
              this.storage.enableGit = true;
              return this.compose.with('@mshima/git:app');
            });
          });
        },
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
          if (!this.storage.enableGit) {
            return;
          }

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
          if (!this.storage.enableGenerator) {
            return;
          }

          return this.compose.with('@mshima/generator:app');
        },
        menu() {
          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu(
              'Regenerate existing files',
              () => {
                this.compose.emit('regenerate');
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

    get composeApi() {
      const self = this;
      return {
        install() {
          self.queueTask({
            taskName: `npmInstall ${self.destinationPath()}`,
            queueName: 'end',
            method: () => {
              console.log(`Running install at ${self.destinationRoot()}`);
              return install({}, {stdout: 'pipe', cwd: self.destinationRoot()}).then(result => {
                console.log(result.stdout);
              });
            },
            run: false,
            once: true
          });
        },

        enableGenerator() {
          return self._enableGenerator();
        }
      };
    }
  };
}

module.exports = {
  createGenerator
};
