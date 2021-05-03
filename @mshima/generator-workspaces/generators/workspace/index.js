import path from 'path';
import ParentGenerator from '@mshima/yeoman-generator-defaults';

export function createGenerator() {
  return class WorkspaceGenerator extends ParentGenerator {
    constructor(args, options, features) {
      super(args, options, { unique: 'argument', ...features });

      this.argument('name', {
        type: String,
        required: true,
        description: 'Package name',
      });

      if (this.options.help) {
        return;
      }

      this.checkEnvironmentVersion('3.3.0');

      this.instanceConfig.defaults({
        name: this.options.name,
      });
    }

    get '#initializing'() {
      return {
        async childContext() {
          await this.setupChildContext();
        },
      };
    }

    get '#prompting'() {
      return {};
    }

    get '#configuring'() {
      return {
        menu() {
          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu(`Go to ${this.options.name} menu`, async () => {
              await this.childContext.with('@mshima/node-package:app');
              return generatorApi.delegateTo(this.childContext);
            });
          });
        },
      };
    }

    get '#default'() {
      return {};
    }

    get '#writing'() {
      return {};
    }

    get '#postWriting'() {
      return {
        async packageJson() {
          const packageJsonGenerator = await this.compose.get('@mshima/package-json:app');

          this.packageJson.defaults({ workspaces: [] });
          const scope = packageJsonGenerator.getScope();
          const folder = scope ? `@${scope}` : 'packages';
          const workspacePath = `${folder}/${this.instanceConfig.get('name')}`;

          const workspaces = this.packageJson.get('workspaces');
          if (!workspaces.includes(workspacePath)) {
            this.packageJson.set('workspaces', workspaces.concat([workspacePath]));
          }
        },
      };
    }

    get '#install'() {
      return {};
    }

    get '#end'() {
      return {};
    }

    async setupChildContext() {
      if (!this.childContext) {
        const packageJsonApi = await this.compose.get('@mshima/package-json:app');
        const scope = packageJsonApi.getScope();
        const folder = scope ? `@${scope}` : 'packages';
        const destinationRoot = path.join(this.destinationPath(folder, this.instanceConfig.get('name')));
        this.childContext = this.env.createCompose(destinationRoot);
      }
    }

    async runCommand(command) {
      return this.childContext.with('@mshima/menu:app+runCommand', undefined, command);
    }

    async runNamespace(namespace) {
      return this.childContext.with(namespace);
    }
  };
}
