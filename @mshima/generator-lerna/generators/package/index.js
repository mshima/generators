const path = require('path');

function createGenerator(env) {
  return class LernaPackageGenerator extends env.requireGenerator() {
    constructor(args, options) {
      super(args, options);
      this.checkEnvironmentVersion('2.10.2');

      this.argument('name', {
        type: String,
        required: true,
        description: 'Package name'
      });

      this.instanceConfig.defaults({
        name: this.options.name
      });

      this.childId = `@mshima/lerna:child#${this.options.name}`;
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
          return this.childContext.with('@mshima/lerna:child', {parentCompose: this.compose, lernaPackageName: this.options.name});
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

    get childContext() {
      if (!this._childContext) {
        const {scope} = this.compose.getConfig('@mshima/package-json');
        const folder = scope ? `@${scope}` : 'packages';
        const destinationRoot = path.join(this.destinationPath(folder, this.options.name));
        this._childContext = this.compose.createChild(this.childId, destinationRoot);
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
