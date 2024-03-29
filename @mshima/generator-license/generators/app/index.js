import ParentGenerator from '@mshima/yeoman-generator-defaults';

export const licenses = [
  { name: 'Apache 2.0', value: 'Apache-2.0' },
  { name: 'MIT', value: 'MIT' },
  { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
  { name: 'BSD 2-Clause (FreeBSD) License', value: 'BSD-2-Clause-FreeBSD' },
  { name: 'BSD 3-Clause (NewBSD) License', value: 'BSD-3-Clause' },
  { name: 'Internet Systems Consortium (ISC) License', value: 'ISC' },
  { name: 'GNU AGPL 3.0', value: 'AGPL-3.0' },
  { name: 'GNU GPL 3.0', value: 'GPL-3.0' },
  { name: 'GNU LGPL 3.0', value: 'LGPL-3.0' },
  { name: 'Unlicense', value: 'unlicense' },
  { name: 'No License (Copyrighted)', value: 'UNLICENSED' },
];

export default class LicenseGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, { uniqueGlobally: true, ...features });

    this.option('year', {
      type: String,
      desc: 'Year(s) to include on the license',
      required: false,
      defaults: new Date().getFullYear(),
    });

    this.option('defaultLicense', {
      type: String,
      desc: 'Default license',
      required: false,
    });

    this.option('license', {
      type: String,
      desc: 'Select a license, so no license prompt will happen, in case you want to handle it outside of this generator',
      required: false,
    });

    this.option('output', {
      type: String,
      desc: 'Set the output file for the generated license',
      required: false,
      defaults: 'LICENSE',
    });

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
      authorApp() {
        return this.compose.require('@mshima/author:app');
      },
    };
  }

  get '#prompting'() {
    return {
      prompting() {
        const prompts = [
          {
            type: 'list',
            name: 'license',
            choices: licenses,
            message: 'Which license do you want to use?',
          },
        ];

        return this.prompt(prompts, this.config);
      },
    };
  }

  get '#configuring'() {
    return {};
  }

  get '#writing'() {
    return {
      async writing() {
        const configs = this.config.getAll();
        if (configs.disableLicenseFileGeneration || !configs.license) {
          return;
        }

        // License file
        const filename = configs.license + '.txt';

        let author = '';
        const authorGenerator = await this.compose.get('@mshima/author:app');
        if (authorGenerator) {
          const authorConfig = authorGenerator.config.getAll();
          author = authorConfig.name;
          if (authorConfig.email) {
            author += ' <' + authorConfig.email.trim() + '>';
          }

          if (authorConfig.url) {
            author += ' (' + authorConfig.url.trim() + ')';
          }
        }

        const previousCopyrightsHolders = configs.previousCopyrightsHolders
          ? '\n' + configs.previousCopyrightsHolders.join('/n')
          : '';

        const destinationFile = this.destinationPath(this.options.output);
        if (this.options.regenerate || !this.fs.exists(destinationFile)) {
          this.fs.copyTpl(this.templatePath(filename), destinationFile, {
            year: this.options.year,
            author,
            previousCopyrightsHolders,
          });
        }
      },
    };
  }
}
