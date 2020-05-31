function createGenerator(env) {
  return class XoAppGenerator extends require('@mshima/generator') {
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
      return {
        packageJson() {
          this.compose.once('@mshima/package-json:app', generatorApi => {
            generatorApi.addScript({
              fix: 'xo --fix',
              pretest: 'xo'
            });
            generatorApi.addDevDependency('xo', '^0.30.0');
          });
        }
      };
    }

    get writing() {
      return {
        xoConfigJson() {
          const destinationPath = this.destinationPath('.xo-config.json');
          if (this.options.override || !this.fs.exists(destinationPath)) {
            this.renderTemplate('.xo-config.json.ejs', destinationPath);
          }
        },
        prettierrc() {
          const destinationPath = this.destinationPath('.prettierrc');
          if (this.options.override || !this.fs.exists(destinationPath)) {
            this.renderTemplate('.prettierrc.ejs', destinationPath);
          }
        }
      };
    }

    get install() {
      return {};
    }

    get end() {
      return {};
    }
  };
}

module.exports = {
  createGenerator
};
