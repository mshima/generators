import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class MochaAppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, features);

    this.checkEnvironmentVersion('3.3.0');
  }

  get '#initializing'() {
    return {};
  }

  get '#prompting'() {
    return {};
  }

  get '#configuring'() {
    return {
      mochaGenerator() {
        return this.compose.with('@mshima/mocha:generator#*');
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
        this.packageJson.merge({
          scripts: {
            test: 'mocha',
          },
          devDependencies: {
            mocha: '^8.4.0',
          },
        });
      },
      eslintRc() {
        const eslintRcStorage = this.createStorage('.eslintrc.json');
        if (!eslintRcStorage.existed) return;
        eslintRcStorage.merge({
          env: {
            mocha: true,
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
