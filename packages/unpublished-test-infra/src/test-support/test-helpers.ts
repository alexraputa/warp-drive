import { getTestMetadata, setupContext, SetupContextOptions, teardownContext, TestContext } from '@ember/test-helpers';

import type { Hooks as DiagnosticHooks } from '@warp-drive/diagnostic/-types';

export function setupTest(hooks: DiagnosticHooks<TestContext>, opts?: SetupContextOptions): void {
  const options = { waitForSettled: false, ...opts };

  hooks.beforeEach(async function (this: TestContext) {
    let testMetadata = getTestMetadata(this);
    testMetadata.framework = 'qunit';

    await setupContext(this, options);
  });

  hooks.afterEach(function (this: TestContext) {
    return teardownContext(this, options);
  });
}
