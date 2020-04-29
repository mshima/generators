const execa = require('execa');

function createGenerator(env) {
  return class AppGenerator extends env.requireGenerator() {
    constructor(args, options) {
      super(args, options);
      this.checkEnvironmentVersion('2.10.2');
      if (!this.compose) {
        throw new Error(`Generator ${this.options.namespace} requires experimental composing enabled`);
      }

      this.choices = [];
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
        },
        setMenuStack() {
          if (!this.compose.shared.menuStack) {
            this.compose.shared.menuStack = [this.options.generatorApi];
          }

          this.menuStack = this.compose.shared.menuStack;
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
      return {};
    }

    get install() {
      return {};
    }

    get end() {
      return {};
    }

    _registerMenu(name, value) {
      this.choices.push({name, value});
    }

    _queueMainMenu() {
      this._debug(`Queueing menu at ${this.destinationPath()}`);
      this.queueTask({
        taskName: `mainMenu:${this.destinationPath()}`,
        once: true,
        method: () => this._promptMainMenu(),
        cancellabel: true
      });
    }

    _promptMainMenu() {
      if (this.options.skipMainMenu === true) {
        return;
      }

      if (this.choices.length === 0) {
        console.log('No menu option was registered');
        return;
      }

      const namespacePrompt = {
        name: 'Run namespace on the context',
        value: () => {
          return this.prompt({
            name: 'namespace',
            validate: answer => {
              if (this.env.toNamespace(answer) || answer === '') {
                return true;
              }

              return 'Must be a valid namespace';
            },
            message: 'Namespace to run?',
            store: true
          }).then(answers => {
            if (answers.namespace) {
              return this.compose.with(answers.namespace);
            }
          });
        }
      };

      const execPrompt = {
        name: 'Run command at current destination path',
        value: () => {
          return this.prompt({
            name: 'command',
            message: 'Command to run?',
            store: true
          }).then(answers => {
            if (answers.command) {
              return this._runCommand(answers.command);
            }
          });
        }
      };

      return this.prompt({
        name: 'menu',
        type: 'list',
        choices: [namespacePrompt, execPrompt].concat(this.choices).concat({name: 'Exit', value: null}),
        message: 'Select an action.',
        pageSize: this.choices.length + 3
      }).then(answers => {
        if (typeof answers.menu === 'function') {
          const promise = answers.menu();
          if (promise instanceof Promise) {
            promise.then(() => this._showCurrentMainMenu());
          } else {
            this._showCurrentMainMenu();
          }

          return promise;
        }

        this.menuStack.pop();
        this._showCurrentMainMenu();
      });
    }

    _showCurrentMainMenu() {
      const menuApi = this.menuStack[this.menuStack.length - 1];
      if (menuApi) {
        menuApi.showMainMenu();
      }
    }

    _runCommand(command) {
      console.log('===============================================');
      console.log(`Running ${command} at ${this.destinationPath()}`);
      const result = execa.commandSync(command, {stdout: 'pipe', cwd: this.destinationPath()});
      console.log(result.stdout);
      console.log('===============================================');
    }

    '#push'() {
      this.menuStack.push(this.options.generatorApi);
    }

    '#runCommand'(command) {
      return this._runCommand(command);
    }

    '#showMainMenu'() {
      this._queueMainMenu();
    }

    '#registerMenu'() {
      this._registerMenu(...arguments);
    }
  };
}

module.exports = {
  createGenerator
};
