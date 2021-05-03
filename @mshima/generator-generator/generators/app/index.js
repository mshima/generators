import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class GeneratorGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, features);
    this.checkEnvironmentVersion('3.3.0');

    this.config.defaults({
      yeomanEnvironmentVersion: '3.3.0',
      yeomanTestVersion: '6.0.0',
    });
  }

  get '#initializing'() {
    return {};
  }

  get '#prompting'() {
    return {};
  }

  get '#configuring'() {
    return {
      nodePackageApp() {
        return this.compose.with('@mshima/node-package:app');
      },
      generatorGenerator() {
        return this.compose.with('@mshima/generator:generator#*');
      },
      menu() {
        this.compose.once('@mshima/menu:app', generatorApi => {
          generatorApi.registerMenu('Create new generator', () => {
            return this.prompt({
              name: 'name',
              message: 'Generator name?',
            }).then(answers => {
              if (answers.name) {
                return this.compose.with(`@mshima/generator:generator#${answers.name}`);
              }
            });
          });
        });
      },
    };
  }

  get '#default'() {
    return {
      packageJson() {
        this.compose.once('@mshima/package-json:app', generatorApi => {
          const packageName = generatorApi.config.get('name');
          const packageNamespace = this.env.namespaceFromPackageName(packageName).unscoped;
          this.config.set('packageNamespace', packageNamespace);
        });
      },
      arg(arg) {
        if (!arg) {
          return;
        }

        return this.compose.with(`@mshima/generator:generator#${arg}`);
      },
      default() {
        const generators = this.config.get(':generator');
        if (!generators || Object.keys(generators).length === 0) {
          return this.compose.with('@mshima/generator:generator#app');
        }
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
          files: ['generators'],
          devDependencies: {
            'yeoman-assert': '^3.1.1',
            'yeoman-environment': `^${this.config.get('yeomanEnvironmentVersion')}`,
            'yeoman-test': `^${this.config.get('yeomanTestVersion')}`,
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

  updateYeoman() {
    this.installDependencies({ bower: false });
  }
}
