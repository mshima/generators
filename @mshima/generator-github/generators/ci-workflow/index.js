import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class GithubCiWorkflowGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, { unique: 'argument', uniqueGlobally: true, ...features });

    this.argument('name', {
      type: String,
      desc: 'File name',
      required: true,
    });

    this.option('regenerate', {
      type: Boolean,
      desc: 'Regenerate files',
      required: false,
    });

    if (this.options.help) {
      return;
    }

    this.instanceConfig.defaults({
      name: this.options.name,
    });

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
      githubWorkflowsTestYml() {
        const destinationFile = this.destinationPath(`.github/workflows/${this.instanceConfig.get('name')}.yml`);
        if (this.options.regenerate || !this.fs.exists(destinationFile)) {
          this.renderTemplate('.github/workflows/node.js.yml.ejs', destinationFile);
        }
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
