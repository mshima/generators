function createGenerator(env) {
  return class LernaChildGenerator extends env.requireGenerator() {
    constructor(args, options) {
      super(args, options);
      this.checkEnvironmentVersion('2.10.2');

      this.lernaPackageName = this.options.lernaPackageName;
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
        composeParent() {
          if (this.compose && this.compose.atParent()) {
            return;
          }

          throw new Error('Lerna child requires parent to be running');
        },
        authorFromParent() {
          return this.compose.once('@mshima/author:app', generatorApi => {
            const optionsFromParent = this.compose.atParent().getConfig('@mshima/author');
            generatorApi.config.set(optionsFromParent);
          });
        },
        licenseFromParent() {
          return this.compose.once('@mshima/license:app', generatorApi => {
            const optionsFromParent = this.compose.atParent().getConfig('@mshima/license');
            generatorApi.config.set({...optionsFromParent, disableLicenseFileGeneration: true});
          });
        },
        packageJsonFromParent() {
          return this.compose.once('@mshima/package-json:app', generatorApi => {
            const {scope, homepage, keywords} = this.compose.atParent().getConfig('@mshima/package-json');
            const optionsForPackageJson = {scope, homepage, keywords, name: this.lernaPackageName};
            generatorApi.config.set(optionsForPackageJson);
          });
        }
      };
    }

    get prompting() {
      return {};
    }

    get configuring() {
      return {
        packageJsonApp() {
          return this.compose.with('@mshima/package-json:app');
        },
        nodePackageApp() {
          return this.compose.with('@mshima/node-package:app', {disableReadme: true});
        },
        menuApp() {
          return this.compose.with('@mshima/menu:app');
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

    '#addDevDependency'(packageName, version) {
      return this.compose.once('@mshima/package-json:app', generatorApi => {
        generatorApi.addDevDependency(packageName, version);
      });
    }
  };
}

module.exports = {
  createGenerator
};
