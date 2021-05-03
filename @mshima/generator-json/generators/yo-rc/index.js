export async function createGenerator(env) {
  const ParentClass = await env.requireGenerator('@mshima/json:app');
  return class JsonYoRcGenerator extends ParentClass {
    constructor(args, options, features) {
      super(args, options, features);
      this.checkEnvironmentVersion('3.3.0');
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

    get '#default'() {
      return {
        yoRc() {
          this._formatJson('.yo-rc.json', { sort: true });
        },
      };
    }

    get '#writing'() {
      return super.writing;
    }

    get '#install'() {
      return {};
    }

    get '#end'() {
      return {};
    }
  };
}
