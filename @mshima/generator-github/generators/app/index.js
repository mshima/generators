function createGenerator() {
  return class GithubAppGenerator extends require('@mshima/yeoman-generator-defaults') {
    constructor(args, options, features) {
      super(args, options, {uniqueGlobally: true, features});
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
        githubCiWorkflow() {
          return this.compose.require('@mshima/github:ci-workflow');
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
  };
}

module.exports = {
  createGenerator
};
