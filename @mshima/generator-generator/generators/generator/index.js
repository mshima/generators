export async function createGenerator(env) {
  const ParentClass = await env.requireGenerator('@mshima/espree:app');
  return class SubGenerator extends ParentClass {
    constructor(args, options, features) {
      super(args, options, { unique: 'argument', ...features });

      this.argument('name', {
        type: String,
        required: true,
        description: 'Generator name',
      });

      if (this.options.help) {
        return;
      }

      this.checkEnvironmentVersion('3.3.0');

      this.compose.on('regenerate', () => {
        this.options.regenerate = true;
      });
    }

    get '#initializing'() {
      return {};
    }

    get '#prompting'() {
      return {};
    }

    get '#configuring'() {
      return {
        defaults(generatorName) {
          this.instanceConfig.defaults({
            yeomanEnvironmentVersion: '3.3.0',
            name: generatorName,
          });
        },
        menu(generatorName) {
          this.compose.once('@mshima/menu:app', generatorApi => {
            generatorApi.registerMenu(`Add mocha test to ${generatorName}`, () => {
              return this._addMochaTest();
            });
          });
        },
      };
    }

    get '#default'() {
      return {};
    }

    get '#writing'() {
      return {
        renderTemplates(generatorName) {
          this.renderTemplate('(.)?*', `generators/${generatorName}/`);
        },
      };
    }

    get '#install'() {
      return {};
    }

    get '#end'() {
      return {};
    }

    _generatorFile() {
      const generatorName = this.instanceConfig.get('name');
      return this.destinationPath(`generators/${generatorName}/index.js`);
    }

    async _addMainMenu() {
      /*
      await this._writeTask(
        this._generatorFile(),
        'initializing',
        'mainMenu',
        `// Compose with menu
          if (this.env._rootGenerator === this) {
            // Queue main menu
            return this.compose.with('@mshima/menu:app+showMainMenu');
          }`
      );
      */
    }

    _addFile(filename) {
      this._writeTask(
        this._generatorFile(),
        'writing',
        this._.camelCase(filename),
        `const destinationFile = this.destinationPath(\`${filename}\`);
          if (this.options.regenerate || !this.fs.exists(destinationFile)) {
            this.renderTemplate('${filename}.ejs', destinationFile);
          }`
      );
    }

    _writeTask(filename, priority, taskName, body) {
      const originalSource = this.readDestination(filename);
      const parsed = this._parseScript(originalSource, { range: true });

      return this._findNode(parsed, [
        ['body', 'id.name', 'createGenerator'],
        ['body.body', 'type', 'ReturnStatement'],
        ['argument.body.body', 'key.name', priority],
        ['value.body.body', 'type', 'ReturnStatement'],
        'argument',
      ])
        .then(node => {
          if (!node.properties) {
            return Promise.reject(new Error('Could not find the node'));
          }

          const empty = node.properties.length === 0;

          const write = (source = originalSource, options = {}) => {
            const {
              position = node.range[0] + 1,
              pre = `
        `,
              post = empty
                ? `
      `
                : ',',
            } = options;

            source =
              source.slice(0, position) +
              `${pre}${taskName}() {
          ${body}
        }${post}` +
              source.slice(position);

            return Promise.resolve(source);
          };

          const remove = (node, source) => {
            source = source.slice(0, node.range[0]) + source.slice(node.range[1]);
            return Promise.resolve(source);
          };

          let promise;
          if (!empty) {
            promise = this._findNode(node, ['properties', ['Property', taskName]]);
            return promise
              .then(node => {
                return remove(node, originalSource).then(source =>
                  write(source, { position: node.range[0], post: '', pre: '' })
                );
              })
              .catch(() => write());
          }

          return write();
        })
        .then(source => {
          if (source) {
            this.writeDestination(filename, source);
          }
        });
    }

    _templateData(path) {
      const { _ } = this;
      return {
        ...super._templateData(path),
        get className() {
          const prefix = _.upperFirst(_.camelCase(this.packageNamespace));
          return `${prefix}${_.upperFirst(_.camelCase(this.name))}`;
        },
      };
    }

    _addMochaTest() {
      return this.compose.require(`@mshima/mocha:generator#${this.options.name}`).then(generatorApi => {
        generatorApi.config.set({
          name: this.options.name,
        });
      });
    }

    _getFiles() {
      return this.instanceConfig.get('files') || [];
    }

    getGeneratorFiles() {
      return this._getFiles();
    }
  };
}
