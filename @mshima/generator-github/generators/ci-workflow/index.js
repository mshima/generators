function createGenerator(env) {
  return class GithubCiWorkflowGenerator extends env.requireGenerator() {
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
      return {};
    }

    get writing() {
      return {
        githubWorkflowsTestYml() {
          const destinationFile = this.destinationPath('.github/workflows/test.yml');
          if (this.options.override || !this.fs.exists(destinationFile)) {
            this.renderTemplate('.github/workflows/test.yml.ejs', destinationFile);
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
