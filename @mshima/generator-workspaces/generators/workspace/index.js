const path = require('path');

function createGenerator() {
  return class WorkspaceGenerator extends require('@mshima/yeoman-generator-defaults') {
    constructor(args, options, features) {
      super(args, options, {unique: 'argument', ...features});

      this.argument('name', {
        type: String,
        required: true,
        description: 'Package name'
      });

      if (this.options.help) {
        return;
      }

      this.checkEnvironmentVersion('3.3.0');

      this.instanceConfig.defaults({
        name: this.options.name
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
      return {
        menu() {
          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu(`Go to ${this.options.name} menu`, () => {
              return this.childContext.with('@mshima/menu:app+push');
            });
          });
        },
        nodePackage() {
          // Return this.childContext.with('@mshima/workspaces:child', {parentCompose: this.compose, workspaceName: this.options.name});
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
        async packageJson() {
          console.log('package json' + this.instanceConfig);
          const packageJsonGenerator = await this.compose.get('@mshima/package-json:app');

          this.packageJson.defaults({workspaces: []});
          let workspaceName = this.instanceConfig.get('name');
          const scope = packageJsonGenerator.getScope();
          if (scope) {
            workspaceName = `@${scope}/${workspaceName}`;
          }
          const workspaces = this.packageJson.get('workspaces');
          if (!workspaces.includes(workspaceName)) {
            this.packageJson.set('workspaces', workspaces.concat([workspaceName]));
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

    get childContext() {
      if (!this._childContext) {
        const {scope} = this.compose.getConfig('@mshima/package-json');
        const folder = scope ? `@${scope}` : 'packages';
        const destinationRoot = path.join(this.destinationPath(folder, this.options.name));
        // This._childContext = this.compose.createChild(this.childId, destinationRoot);
      }

      return this._childContext;
    }

    '#runCommand'(command) {
      return this.childContext.with('@mshima/menu:app+runCommand', undefined, command);
    }

    '#runNamespace'(namespace) {
      return this.childContext.with(namespace);
    }
  };
}

module.exports = {
  createGenerator
};
