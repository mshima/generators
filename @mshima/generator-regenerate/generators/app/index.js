const GENERATOR_MENU = '@mshima/menu:app';

import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class RegenerateAppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, features);

    if (this.options.help) {
      return;
    }

    this.checkEnvironmentVersion('3.3.0');

    this.withGenerators = this.config.createStorage('with');
  }

  get '#initializing'() {
    return {};
  }

  get '#prompting'() {
    return {};
  }

  get '#configuring'() {
    return {};
  }

  get '#composing'() {
    return {
      composing() {
        return this.compose.with(this.getComposedGenerators());
      },
      menu() {
        this.compose.once(GENERATOR_MENU, generatorApi => {
          generatorApi.registerMenu('Regenerate existing files', () => {
            this.compose.emit('regenerate');
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
    return {};
  }

  get '#install'() {
    return {};
  }

  get '#end'() {
    return {};
  }

  registerRequired(required = []) {
    required = [].concat(required);
    required.forEach(required => {
      this.withGenerators.set(required, true);
    });
  }

  registerOptional(optionals = []) {
    optionals = [].concat(optionals);
    optionals.forEach(optionalGenerator => {
      if (this.withGenerators.get(optionalGenerator)) {
        return;
      }
      this.compose.once(GENERATOR_MENU, generator => {
        generator.registerMenu(`Enable ${optionalGenerator}`, () => {
          this.withGenerators.set(optionalGenerator, true);
          return this.compose.with(optionalGenerator);
        });
      });
    });
  }

  getComposedGenerators() {
    return Object.entries(this.withGenerators.getAll())
      .filter(([, enabled]) => enabled)
      .map(([namespace]) => namespace);
  }
}
