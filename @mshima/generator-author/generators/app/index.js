const PROMPTS = [
  {
    name: 'name',
    message: "Author's Name",
    store: true,
  },
  {
    name: 'email',
    message: "Author's Email",
    store: true,
  },
  {
    name: 'url',
    message: "Author's Homepage",
    store: true,
  },
];

import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class AuthorAppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, { uniqueGlobally: true, features });
    this.checkEnvironmentVersion('3.3.0');

    this.option('name', {
      type: String,
      desc: "Author's Name",
      required: false,
    });
    this.option('email', {
      type: String,
      desc: "Author's Email",
      required: false,
    });
    this.option('url', {
      type: String,
      desc: "Author's Homepage",
      required: false,
    });

    for (const option of ['name', 'email', 'url']) {
      const value = this.options[option];
      if (value !== undefined) {
        this.config.set(option, value);
      }
    }
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
      prompts() {
        return this.prompt(PROMPTS, this.config);
      },
    };
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
    return {};
  }

  get '#install'() {
    return {};
  }

  get '#end'() {
    return {};
  }
}
