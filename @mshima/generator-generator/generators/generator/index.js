function createGenerator(env) {
  const SuperClass = env.requireGenerator('@mshima/espree:app');
  return class SubGenerator extends SuperClass {
    constructor(args, options) {
      super(args, options);
      this.checkEnvironmentVersion('2.10.2');

      this.argument('name', {
        type: String,
        required: true,
        description: 'Generator name'
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
        defaults(generatorName) {
          this.instanceConfig.defaults({
            yeomanEnvironmentVersion: '2.10.2',
            name: generatorName
          });
        },
        menu() {
          this.compose.once('@mshima/menu:app', generatorApi => {
            const name = this.instanceConfig.get('name');
            generatorApi.registerMenu(`Add menu support to ${name}`, () => {
              this._addMainMenu();
            });

            generatorApi.registerMenu(`Add mocha test to ${name}`, () => {
              return this._addMochaTest();
            });

            generatorApi.registerMenu(`Add compose entry to ${name}`, () => {
              return this.prompt({
                name: 'name',
                message: `Namespace to compose?
Format: package-namespace:gen
Versioned: @scope/package-namespace:generator@>=0.0.1
`,
                validate: answer => {
                  const namespace = this.env.toNamespace(answer);
                  if (!namespace) {
                    return 'Must be a valid namespace';
                  }

                  if (!namespace.generator) {
                    return 'Namespace must contain a sub generator ex: foo-bar:app';
                  }

                  return true;
                }
              }).then(answers => {
                if (answers.name) {
                  this._addComposeWithEntry(answers.name);
                }
              });
            });

            generatorApi.registerMenu(`Add file to ${name}`, () => {
              return this.prompt({
                name: 'filename',
                message: 'File to create'
              }).then(answers => {
                if (answers.filename) {
                  const files = this.instanceConfig.get('files') || [];
                  if (!files.includes(answers.filename)) {
                    files.push(answers.filename);
                    this.instanceConfig.set('files', files);
                  }

                  this._addFile(answers.filename);
                }
              });
            });
          });
        }
      };
    }

    get default() {
      return {};
    }

    get writing() {
      return {
        writeFiles() {
          const generatorFile = this._generatorFile();
          if (this.options.override || !this.existsDestination(generatorFile)) {
            this.renderTemplate('index.js.ejs', generatorFile);
          }

          const generatorName = this.instanceConfig.get('name');
          const files = this._getFiles();
          files.forEach(file => {
            const destinationFile = this.destinationPath(`generators/${generatorName}/templates/${file}.ejs`);
            if (!this.options.override && this.existsDestination(destinationFile)) {
              return;
            }

            this.copyTemplate('EMPTY_FILE', destinationFile);
          });

          try {
            this._addComposeInitialization();
          } catch (error) {
            console.log(`error parsing ${generatorFile}`);
            console.log(error);
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

    _generatorFile() {
      const generatorName = this.instanceConfig.get('name');
      return this.destinationPath(`generators/${generatorName}/index.js`);
    }

    _addMainMenu() {
      this._writeTask(this._generatorFile(), 'initializing', 'mainMenu', `// Compose with menu
          if (this.env._rootGenerator === this) {
            // Queue main menu
            return this.compose.with('@mshima/menu:app+showMainMenu');
          }`);
      this.compose.once('@mshima/package-json:app', generatorApi => {
        generatorApi.addPeerDependency('@mshima/generator-menu', '*');
      });
    }

    _addComposeWithEntry(namespace) {
      namespace = this.env.requireNamespace(namespace);
      const methodName = this._.camelCase(namespace.unscopedNamespace);
      this._writeTask(
        this._generatorFile(),
        'configuring',
        methodName,
        `return this.compose.require('${namespace}');`
      );
      this.compose.api.packageJson.addPeerDependency(namespace.generatorHint, namespace.semver || '*');
    }

    _addComposeInitialization() {
      this._writeTask(
        this._generatorFile(),
        'initializing',
        'composeContext',
        `if (this.compose) {
            return;
          }

          if (this.env._rootGenerator && this.env._rootGenerator !== this) {
            throw new Error(\`Generator \${this.options.namespace} requires experimental composing enabled\`);
          }

          this.compose = this.env.createCompose(this.destinationRoot());`
      );
    }

    _addFile(filename) {
      this._writeTask(
        this._generatorFile(),
        'writing',
        this._.camelCase(filename),
        `const destinationFile = this.destinationPath(\`${filename}\`);
          if (this.options.override || !this.fs.exists(destinationFile)) {
            this.renderTemplate('${filename}.ejs', destinationFile);
          }`
      );
    }

    _writeTask(filename, priority, taskName, body) {
      const originalSource = this.readDestination(filename);
      const parsed = this._parseScript(originalSource, {range: true});

      this._findNode(parsed, [
        ['body', 'id.name', 'createGenerator'],
        ['body.body', 'type', 'ReturnStatement'],
        ['argument.body.body', 'key.name', priority],
        ['value.body.body', 'type', 'ReturnStatement'],
        'argument'
      ]).then(node => {
        if (!node.properties) {
          return Promise.reject(new Error('Could not find the node'));
        }

        const empty = !node.properties.length;

        const write = (source = originalSource, options = {}) => {
          const {
            position = node.range[0] + 1,
            pre = `
        `,
            post = empty ? `
      ` : ','
          } = options;

          source = source.slice(0, position) + `${pre}${taskName}() {
          ${body}
        }${post}` + source.slice(position);

          return Promise.resolve(source);
        };

        const remove = (node, source) => {
          source = source.slice(0, node.range[0]) + source.slice(node.range[1]);
          return Promise.resolve(source);
        };

        let promise;
        if (!empty) {
          promise = this._findNode(node, ['properties', ['Property', taskName]]);
          return promise.then(node => {
            return remove(node, originalSource).then(source => write(source, {position: node.range[0], post: '', pre: ''}));
          }).catch(() => write());
        }

        return write();
      }).then(source => {
        if (source) {
          this.writeDestination(filename, source);
        }
      });
    }

    _templateData(path) {
      const {_} = this;
      return {
        ...super._templateData(path),
        get className() {
          const prefix = _.upperFirst(_.camelCase(this.packageNamespace));
          return `${prefix}${_.upperFirst(_.camelCase(this.name))}`;
        }
      };
    }

    _addMochaTest() {
      const packageNamespace = this.config.get('packageNamespace');
      return this.compose.require(`@mshima/mocha:generator#${this.options.name}`).then(generatorApi => {
        generatorApi.config.set({
          name: this.options.name,
          packageNamespace
        });
      });
    }

    _getFiles() {
      return this.instanceConfig.get('files') || [];
    }

    '#getGeneratorFiles'() {
      return this._getFiles();
    }

    '#override'() {
      this.options.override = true;
    }
  };
}

module.exports = {
  createGenerator
};
