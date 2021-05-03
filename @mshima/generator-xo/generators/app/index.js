import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class XoAppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, { unique: true, features });

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
    return {
      composeContext() {
        if (this.compose) {
          return;
        }

        if (this.env._rootGenerator && this.env._rootGenerator !== this) {
          throw new Error(`Generator ${this.options.namespace} requires experimental composing enabled`);
        }

        this.compose = this.env.createCompose(this.destinationRoot());
      },
    };
  }

  get '#prompting'() {
    return {};
  }

  get '#configuring'() {
    return {};
  }

  get '#writing'() {
    return {
      xoConfigJson() {
        const destinationPath = this.destinationPath('.xo-config.json');
        if (this.options.regenerate || !this.fs.exists(destinationPath)) {
          this.renderTemplate('.xo-config.json.ejs', destinationPath);
        }
      },
      prettierrc() {
        const destinationPath = this.destinationPath('.prettierrc');
        if (this.options.regenerate || !this.fs.exists(destinationPath)) {
          this.renderTemplate('.prettierrc.ejs', destinationPath);
        }
      },
    };
  }

  get '#postWriting'() {
    return {
      packageJson() {
        this.packageJson.merge({
          scripts: {
            fix: 'xo --fix',
            pretest: 'xo',
          },
          devDependencies: {
            xo: '^0.40.1',
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
