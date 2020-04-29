'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('license:app', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create(
        '@mshima/license:app',
        {},
        {experimental: true}
      )
      .withLookups([
        {npmPaths: path.join(__dirname, '..', '..')}
      ]);
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  describe('license:app - generate Apache 2.0 license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'Apache-2.0'
        })
        .run();
    });

    it('creates LICENSE file using Apache 2.0 template', () => {
      assert.fileContent('LICENSE', 'Apache License, Version 2.0');
      assert.fileContent(
        'LICENSE',
        'Copyright 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate Apache 2.0 license with 2013-2015 year', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2013-2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'Apache-2.0'
        }).run();
    });

    it('creates LICENSE file using Apache 2.0 template', () => {
      assert.fileContent('LICENSE', 'Apache License, Version 2.0');
      assert.fileContent(
        'LICENSE',
        'Copyright 2013-2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate BSD 2 license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'BSD-2-Clause-FreeBSD'
        }).run();
    });

    it('creates LICENSE file using BSD 2 template', () => {
      assert.fileContent('LICENSE', 'FreeBSD Project');
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate BSD 3 license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'BSD-3-Clause'
        }).run();
    });

    it('creates LICENSE file using BSD 3 template', () => {
      assert.fileContent(
        'LICENSE',
        'THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"'
      );
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate ISC license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'ISC'
        }).run();
    });

    it('creates LICENSE file using ISC template', () => {
      assert.fileContent('LICENSE', 'THE SOFTWARE IS PROVIDED "AS IS"');
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate GNU AGPL 3.0 license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'AGPL-3.0'
        }).run();
    });

    it('creates LICENSE file using AGPL-3.0 template', () => {
      assert.fileContent('LICENSE', 'GNU AFFERO GENERAL PUBLIC LICENSE');
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate MIT license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'MIT'
        }).run();
    });

    it('creates LICENSE file using MIT template', () => {
      assert.fileContent('LICENSE', 'The MIT License (MIT)');
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate MPL 2.0 license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'MPL-2.0'
        }).run();
    });

    it('creates LICENSE file using MPL 2.0 template', () => {
      assert.fileContent('LICENSE', 'Mozilla Public License Version 2.0');
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate copyrighted license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'UNLICENSED'
        }).run();
    });

    it('creates LICENSE file using UNLICENSED template', () => {
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate unlicense license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'unlicense'
        }).run();
    });

    it('creates LICENSE file using unlicense template', () => {
      assert.fileContent(
        'LICENSE',
        'This is free and unencumbered software released into the public domain.'
      );
    });
  });

  describe('license:app - generate GPL-3.0 license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'GPL-3.0'
        }).run();
    });

    it('creates LICENSE file using GPL-3.0 template', () => {
      assert.fileContent('LICENSE', 'GNU GENERAL PUBLIC LICENSE');
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate LGPL-3.0 license', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'LGPL-3.0'
        }).run();
    });

    it('creates LICENSE file using LGPL-3.0 template and also contains GPL-3.0', () => {
    // Both licenses must be included when using LGPL
    // the test below is intended to check for both licenses as both are
    // included in the file
      assert.fileContent('LICENSE', 'GNU LESSER GENERAL PUBLIC LICENSE');
      assert.fileContent('LICENSE', 'GNU GENERAL PUBLIC LICENSE');
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });

  describe('license:app - generate GPL-3.0 license invalid option', () => {
    beforeEach(() => {
      return ctx
        .withOptions({
          year: '2015',
          force: true,
          license: 'NOTVALID'
        })
        .withPrompts({
          name: 'Rick',
          email: 'foo@example.com',
          url: 'http://example.com',
          license: 'GPL-3.0'
        }).run();
    });

    it('creates LICENSE file using GPL-3.0 template', () => {
      assert.fileContent('LICENSE', 'GNU GENERAL PUBLIC LICENSE');
      assert.fileContent(
        'LICENSE',
        'Copyright (c) 2015 Rick <foo@example.com> (http://example.com)'
      );
    });
  });
});

