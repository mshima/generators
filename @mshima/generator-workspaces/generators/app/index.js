import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class AppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, features);

    if (this.options.help) {
      return;
    }

    this.checkEnvironmentVersion('3.3.0');
  }

  get '#initializing'() {
    return {
      mainMenu() {
        return this.compose.with('@mshima/menu:app');
      },
    };
  }

  get '#prompting'() {
    return {};
  }

  get '#configuring'() {
    return {};
  }

  get '#composing'() {
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
        return this.compose.require('@mshima/package-json:app');
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

        this.compose.once('@mshima/menu:app', menu => {
          menu.registerMenu('Create new package', () => {
            return this.prompt({
              name: 'name',
              message: 'Package name?',
            }).then(answers => {
              if (answers.name) {
                return this._createPackage(answers.name);
              }
            });
          });

          menu.registerMenu('Run namespace at each package', async () => {
            const answers = await this.prompt({
              name: 'namespace',
              validate: answer => {
                if (this.env.toNamespace(answer) || answer === '') {
                  return true;
                }

                return 'Must be a valid namespace';
              },
              message: 'Namespace to run?',
              store: true,
            });
            if (answers.namespace) {
              const composed = await this.compose.with('@mshima/workspaces:workspace#*');
              await composed.runNamespace(answers.namespace);
            }
          });

          menu.registerMenu('Run command at each package', () => {
            return this.prompt({
              name: 'command',
              message: 'Command to run?',
              store: true,
            }).then(answers => {
              if (answers.command) {
                return this.compose.with('@mshima/workspaces:workspace#*').then(composeWith => {
                  composeWith.runCommand(answers.command);
                });
              }
            });
          });
        });
      },
    };
  }

  get '#default'() {
    return {
      workspaces() {
        return this.compose.with('@mshima/workspaces:workspace#*');
      },
    };
  }

  get '#writing'() {
    return {};
  }

  get '#postWriting'() {
    return {
      packageJson() {
        this.packageJson.merge({
          scripts: {
            test: 'npm run test --workspaces --if-present',
          },
        });
      },
    };
  }

  get '#install'() {
    return {};
  }

  get '#end'() {
    return {};
  }

  _createPackage(name) {
    return this.compose.with(`@mshima/workspaces:workspace#${name}`);
  }
}
