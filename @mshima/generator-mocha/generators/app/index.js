function createGenerator() {
  return class MochaAppGenerator extends require('@mshima/yeoman-generator-defaults') {
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
        }
      };
    }

    get prompting() {
      return {};
    }

    get configuring() {
      return {
        mochaGenerator() {
          return this.compose.with('@mshima/mocha:generator#*');
        }
      };
    }

    get default() {
      return {};
    }

    get writing() {
      return {};
    }

    get postWriting() {
      return {
        packageJson() {
          this.packageJson.merge({
            scripts: {
              test: 'mocha'
            },
            devDependencies: {
              mocha: '^7.1.2'
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
  };
}

module.exports = {
  createGenerator
};
