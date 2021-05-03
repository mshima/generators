import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class ReadmeAppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, { uniqueGlobally: true, features });

    this.option('regenerate', {
      type: Boolean,
      desc: 'Regenerate files',
      required: false,
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
    return {};
  }

  get '#default'() {
    return {};
  }

  get '#writing'() {
    return {
      readmeMd() {
        this.renderTemplate('(.)?*', '');
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
