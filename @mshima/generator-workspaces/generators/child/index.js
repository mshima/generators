import ParentGenerator from '@mshima/yeoman-generator-defaults';

export function createGenerator() {
  return class WorkspaceGenerator extends ParentGenerator {
    constructor(args, options, features) {
      super(args, options, { unique: 'argument', ...features });

      this.argument('workspaceName', {
        type: String,
        required: true,
        description: 'Workspace name',
      });

      if (this.options.help) {
        return;
      }

      this.checkEnvironmentVersion('3.3.0');

      this.workspaceName = this.options.workspaceName;
    }

    get '#initializing'() {
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
        authorFromParent() {
          return this.compose.once('@mshima/author:app', generatorApi => {
            const optionsFromParent = this.compose.atParent().getConfig('@mshima/author');
            generatorApi.config.set(optionsFromParent);
          });
        },
        licenseFromParent() {
          return this.compose.once('@mshima/license:app', generatorApi => {
            const optionsFromParent = this.compose.atParent().getConfig('@mshima/license');
            generatorApi.config.set({ ...optionsFromParent, disableLicenseFileGeneration: true });
          });
        },
        packageJsonFromParent() {
          return this.compose.once('@mshima/package-json:app', generatorApi => {
            const { scope, homepage, keywords } = this.compose.atParent().getConfig('@mshima/package-json');
            const optionsForPackageJson = { scope, homepage, keywords, name: this.workpaceName };
            generatorApi.config.set(optionsForPackageJson);
          });
        },
      };
    }

    get '#prompting'() {
      return {};
    }

    get '#configuring'() {
      return {
        nodePackageApp() {
          return this.compose.with('@mshima/node-package:app');
        },
      };
    }

    get '#default'() {
      return {};
    }

    get '#writing'() {
      return {};
    }

    get '#install'() {
      return {};
    }

    get '#end'() {
      return {};
    }
  };
}
