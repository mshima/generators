function createGenerator() {
  return class ReadmeAppGenerator extends require('@mshima/yeoman-generator-defaults') {
    constructor(args, options, features) {
      super(args, options, features);

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
        readmeMd() {
          const destinationPath = this.destinationPath('README.md');
          if (this.options.regenerate || !this.fs.exists(destinationPath)) {
            this.renderTemplate('README.md.ejs', destinationPath);
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

    _templateData() {
      const self = this;
      return {
        ...super._templateData(),
        composeData: {
          get license() {
            if (!self.compose.api.license) {
              return null;
            }

            return self.compose.api.license.config.getAll();
          },
          get author() {
            if (!self.compose.api.author) {
              return null;
            }

            return self.compose.api.author.config.getAll();
          }
        }
      };
    }
  };
}

module.exports = {
  createGenerator
};
