import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class EslintAppGenerator extends ParentGenerator {
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
            'pretest:eslint': 'npm run eslint:check',
            fix: 'concurrently -m 1 npm:fix:*',
            'fix:eslint': 'npm run eslint:fix',
            'eslint:fix': 'eslint --fix .',
            'eslint:check': 'eslint .',
          },
          devDependencies: {
            concurrently: '^4.1.0',
            eslint: '7.26.0',
            'eslint-plugin-import': '2.23.2',
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
