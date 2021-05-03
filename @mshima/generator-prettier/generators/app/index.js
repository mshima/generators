import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mainPackageJson = require('../../package.json');

import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class PrettierAppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, features);

    if (this.options.help) {
      return;
    }

    this.checkEnvironmentVersion('3.3.0');
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
    return {};
  }

  get '#default'() {
    return {};
  }

  get '#writing'() {
    return {
      writeFiles() {
        this.renderTemplate('(.)?*', '');
      },
    };
  }

  get '#postWriting'() {
    return {
      packageJson() {
        this.packageJson.merge({
          scripts: {
            pretest: 'concurrently -m 1 npm:pretest:*',
            'pretest:prettier': 'npm run prettier:check',
            fix: 'concurrently -m 1 npm:fix:*',
            'fix:prettier': 'npm run prettier:write',
            'prettier:write': 'prettier --write .',
            'prettier:check': 'prettier --check .',
          },
          devDependencies: {
            concurrently: '^4.1.0',
            prettier: mainPackageJson.dependencies.prettier,
          },
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
