const GENERATOR_REGENERATE = '@mshima/regenerate:app';
const GENERATOR_MENU = '@mshima/menu:app';
const GENERATOR_GIT = '@mshima/git:app';
const GENERATOR_XO = '@mshima/xo:app';
const GENERATOR_MOCHA = '@mshima/mocha:app';
const GENERATOR_GENERATOR = '@mshima/generator:app';

const OPTIONAL_GENERATORS = [GENERATOR_GIT, GENERATOR_MOCHA, GENERATOR_GENERATOR];
const REQUIRED_GENERATORS = ['@mshima/json:yo-rc', '@mshima/package-json:app', '@mshima/readme:app'];

import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class NodePackageAppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, features);

    if (this.options.help) {
      return;
    }

    this.checkEnvironmentVersion('3.3.0');
  }

  get '#initializing'() {
    return {
      mainMenu() {
        return this.compose.with(GENERATOR_MENU);
      },
      async regenerate() {
        const regenerateGenerator = await this.compose.with(GENERATOR_REGENERATE);

        regenerateGenerator.registerRequired('@mshima/node-package:app');

        const { enableGit, enableGenerator } = this.options;

        if (enableGit || this.storage.enableGit) {
          regenerateGenerator.registerRequired(GENERATOR_GIT);
          this.storage.enableGit = undefined;
        }
        if (this.storage.enableXo) {
          regenerateGenerator.registerRequired(GENERATOR_XO);
          this.storage.enableXo = undefined;
        }
        if (this.storage.enableMocha) {
          regenerateGenerator.registerRequired(GENERATOR_MOCHA);
          this.storage.enableMocha = undefined;
        }
        if (enableGenerator || this.storage.enableGenerator) {
          regenerateGenerator.registerRequired(GENERATOR_GENERATOR);
          this.storage.enableGenerator = undefined;
        }

        if (this.config.get('with')) {
          Object.keys(this.config.get('with')).forEach(generator => regenerateGenerator.registerRequired(generator));
          this.config.delete('with');
        }

        regenerateGenerator.registerOptional(OPTIONAL_GENERATORS);
      },
    };
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
        return this.compose.with(REQUIRED_GENERATORS);
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
      packageJson() {
        this.packageJson.defaults({
          type: 'module',
        });
      },
    };
  }

  get '#install'() {
    return {};
  }

  get '#end'() {
    return {};
  }
}
