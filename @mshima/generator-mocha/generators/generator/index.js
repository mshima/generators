const SAMPLE_TEST = 'with sample values';

const insertTextInTheEnd = (node, source, body) => {
  source = source.slice(0, node.range[1] - 1) + body + source.slice(node.range[1] - 1);
  return Promise.resolve(source);
};

function createGenerator(env) {
  return class MochaGeneratorGenerator extends env.requireGenerator('@mshima/espree:app') {
    constructor(args, options) {
      super(args, options);
      this.checkEnvironmentVersion('2.10.2');

      this.name = this._namespaceId.instanceId;
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
      return {
        defaults() {
          this.instanceConfig.defaults({name: this.name});
        }
      };
    }

    get writing() {
      return {
        writeGeneratorTest() {
          const destinationPath = this.destinationPath(`test/${this.name}.spec.js`);
          if (this.options.override || !this.fs.exists(destinationPath)) {
            this.renderTemplate('app.spec.js.ejs', destinationPath);
          }
        },
        writeFiles() {
          this.compose.once(`@mshima/generator:generator#${this.name}`, generatorApi => {
            const files = generatorApi.getGeneratorFiles();
            const destinationPath = this.destinationPath(`test/${this.name}.spec.js`);
            files.forEach(file => {
              this._writeTest(destinationPath, `writes ${file}`, `  it('writes ${file}', () => {
      assert.file(path.join(ctx.targetDirectory, '${file}'));
    });
  `);
            });
          });
        }
      };
    }

    get install() {
      return {};
    }

    get end() {
      return {};
    }

    _templateData(path) {
      const self = this;
      const templateData = super._templateData(path);
      return {
        ...templateData,
        get scope() {
          return self._getStorage('@mshima/generator-package-json').get('scope');
        },
        get scopePrefix() {
          const scope = this.scope;
          return scope ? `@${scope}/` : '';
        }
      };
    }

    _writeTest(filename, description, body) {
      const originalSource = this.readDestination(filename);
      const parsed = this._parseScript(originalSource, {range: true});
      const templateData = this._templateData();

      this._findNode(parsed, [
        // Look for generator describe
        ['body', 'expression.arguments[0].value', `${templateData.scopePrefix}${templateData.packageNamespace}:${this.name}`],
        // Look for sample test
        ['expression.arguments[1].body.body', 'expression.arguments[0].value', SAMPLE_TEST],
        // Get sample body
        'expression.arguments[1].body'
      ]).then(sampleTestBody => {
        return this._findNode(sampleTestBody, [
          // Look for the write describe
          ['body', 'expression.arguments[0].value', description]
        ]).catch(() => {
          // If not found write.
          return insertTextInTheEnd(sampleTestBody, originalSource, body).then(source => {
            this.writeDestination(filename, source);
          });
        });
      });
    }

    '#override'() {
      this.options.override = true;
    }
  };
}

module.exports = {
  createGenerator
};
