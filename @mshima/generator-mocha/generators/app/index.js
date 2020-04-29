function createGenerator(env) {
  return class MochaAppGenerator extends env.requireGenerator() {
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
      return {
        mochaGenerator() {
          return this.compose.with('@mshima/mocha:generator#*');
        }
      };
    }

    get default() {
      return {
        packageJson() {
          this.compose.once('@mshima/package-json:app', generatorApi => {
            generatorApi.addScript('test', 'mocha');
            generatorApi.addDevDependency('mocha', '^7.1.2');
          });
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

    '#override'() {
      return this.compose.with('@mshima/mocha:generator#*+override');
    }
  };
}

module.exports = {
  createGenerator
};
