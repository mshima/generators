import execa from 'execa';
import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class AppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, features);
    this.checkEnvironmentVersion('3.3.0');

    this.choices = [];
  }

  get '#initializing'() {
    return {};
  }

  get '#mainMenu'() {
    return {
      mainMenu() {
        this._queueMainMenu();
      },
    };
  }

  get '#prompting'() {
    return {};
  }

  get '#configuring'() {
    return {};
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

  _queueMainMenu() {
    this._debug(`Queueing menu at ${this.destinationPath()}`);
    this.queueTask({
      taskName: `mainMenu:${this.destinationPath()}`,
      once: true,
      method: () => this._promptMainMenu(),
      cancellabel: true,
    });
  }

  async _promptMainMenu() {
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
          store: true,
        }).then(answers => {
          if (answers.namespace) {
            return this.compose.with(answers.namespace);
          }
        });
      },
    };

    const execPrompt = {
      name: 'Run command at current destination path',
      value: () => {
        return this.prompt({
          name: 'command',
          message: 'Command to run?',
          store: true,
        }).then(answers => {
          if (answers.command) {
            return this._runCommand(answers.command);
          }
        });
      },
    };

    const answers = await this.prompt({
      name: 'menu',
      type: 'list',
      choices: [namespacePrompt, execPrompt].concat(this.choices).concat({ name: 'Exit', value: null }),
      message: 'Select an action.',
      pageSize: this.choices.length + 3,
    });

    if (typeof answers.menu === 'function') {
      await answers.menu();
      if (!this.paused) {
        this._queueMainMenu();
      }
    }

    this.emit('exit');
  }

  _runCommand(command) {
    console.log('===============================================');
    console.log(`Running ${command} at ${this.destinationPath()}`);
    const result = execa.commandSync(command, { stdout: 'pipe', cwd: this.destinationPath() });
    console.log(result.stdout);
    console.log('===============================================');
  }

  runCommand(command) {
    return this._runCommand(command);
  }

  showMainMenu() {
    this._queueMainMenu();
  }

  registerMenu(name, value) {
    this.choices.push({ name, value });
  }

  async delegateTo(compose) {
    const childMenu = await compose.with('@mshima/menu:app');
    childMenu.showMainMenu();
    childMenu.on('exit', () => {
      this._queueMainMenu();
      this.paused = false;
    });
    this.paused = true;
  }
}
