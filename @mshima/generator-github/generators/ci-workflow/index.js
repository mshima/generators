function createGenerator() {
  return class GithubCiWorkflowGenerator extends require('@mshima/yeoman-generator-defaults') {
    constructor(args, options, features) {
      super(args, options, {uniqueGlobally: true, features});

      this.option('regenerate', {
        type: Boolean,
        desc: 'Regenerate files',
        required: false
      });

      if (this.options.help) {
        return;
      }

      this.checkEnvironmentVersion('3.3.0');

      this.compose.on('regenerate', () => {
        this.options.regenerate = true;
      });
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
          if (this.options.regenerate || !this.fs.exists(destinationFile)) {
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
