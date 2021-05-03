import ParentGenerator from '@mshima/yeoman-generator-defaults';

export default class GithubAppGenerator extends ParentGenerator {
  constructor(args, options, features) {
    super(args, options, { uniqueGlobally: true, features });
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
      githubCiWorkflow() {
        return this.compose.require('@mshima/github:ci-workflow#node.js');
      },
    };
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
