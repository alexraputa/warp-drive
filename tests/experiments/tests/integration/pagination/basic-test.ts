import { Fetch, RequestManager } from '@warp-drive/core';
import type { CollectionResourceDataDocument } from '@warp-drive/core/types/spec/document';
import { module, test } from '@warp-drive/diagnostic';
import { clearPaginationCache, getPaginationState } from '@warp-drive/experiments/pagination';
import { MockServerHandler } from '@warp-drive/holodeck';
import { GET } from '@warp-drive/holodeck/mock';
import { buildBaseURL } from '@warp-drive/utilities';

type UserResource = {
  id: string;
  type: 'user';
  attributes: {
    name: string;
  };
};

module('Integration | Pagination | cyclic links', function (hooks) {
  hooks.beforeEach(function () {
    clearPaginationCache();
  });

  test('loadNext does not revisit the current page through a self-referential next link', async function (assert) {
    const manager = new RequestManager();
    manager.use([new MockServerHandler(this), Fetch]);

    const url = buildBaseURL({ resourcePath: 'users/1' });

    await GET(this, 'users/1', () => ({
      data: [
        {
          id: '1',
          type: 'user',
          attributes: { name: 'Chris Thoburn' },
        },
      ],
      links: {
        self: url,
        next: url,
      },
    }));

    const request = manager.request<CollectionResourceDataDocument<UserResource>>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;

    const result = await paginationState.loadNext();

    assert.equal(result, null, 'the current page is not loaded again as its own successor');
    assert.false(paginationState.hasNext, 'a self-referential next link does not leave a forward frontier');
    assert.false(
      paginationState.hasPrevious,
      'a self-referential next link does not infer the current page as its own predecessor'
    );
    assert.equal(Array.from(paginationState.pages).length, 1, 'the frontier still contains exactly one page');
  });

  test('loadPrev does not revisit the current page through a self-referential prev link', async function (assert) {
    const manager = new RequestManager();
    manager.use([new MockServerHandler(this), Fetch]);

    const url = buildBaseURL({ resourcePath: 'users/1' });

    await GET(this, 'users/1', () => ({
      data: [
        {
          id: '1',
          type: 'user',
          attributes: { name: 'Chris Thoburn' },
        },
      ],
      links: {
        prev: url,
        self: url,
      },
    }));

    const request = manager.request<CollectionResourceDataDocument<UserResource>>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;

    const result = await paginationState.loadPrev();

    assert.equal(result, null, 'the current page is not loaded again as its own predecessor');
    assert.false(paginationState.hasPrevious, 'a self-referential prev link does not leave a backward frontier');
    assert.false(
      paginationState.hasNext,
      'a self-referential prev link does not infer the current page as its own successor'
    );
    assert.equal(Array.from(paginationState.pages).length, 1, 'the frontier still contains exactly one page');
  });
});
