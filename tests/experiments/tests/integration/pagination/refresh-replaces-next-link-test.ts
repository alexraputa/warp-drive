import { Fetch, RequestManager } from '@warp-drive/core';
import type { CacheHandler, Future, NextFn } from '@warp-drive/core/request';
import type { RequestContext, StructuredDataDocument } from '@warp-drive/core/types/request';
import type { CollectionResourceDataDocument } from '@warp-drive/core/types/spec/document';
import type { PaginationLinks } from '@warp-drive/core/types/spec/json-api-raw';
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

class SimpleCacheHandler implements CacheHandler {
  _cache: Map<string, unknown> = new Map();

  request<T = unknown>(
    context: RequestContext,
    next: NextFn<T>
  ): T | Promise<T | StructuredDataDocument<T>> | Future<T> {
    const { url, method, cacheOptions } = context.request;
    if (url && method === 'GET' && this._cache.has(url) && cacheOptions?.reload !== true) {
      return this._cache.get(url) as T;
    }

    const future = next(context.request);
    context.setStream(future.getStream());

    return future.then(
      (result) => {
        if (url && method === 'GET') {
          this._cache.set(url, result);
        }
        return result;
      },
      (error) => {
        if (url && method === 'GET') {
          this._cache.set(url, error);
        }
        throw error;
      }
    );
  }
}

module('Integration | Pagination | refreshed links', function (hooks) {
  hooks.beforeEach(function () {
    clearPaginationCache();
  });

  test('re-adopting a refreshed page replaces an existing next link', async function (assert) {
    const manager = new RequestManager();
    manager.use([new MockServerHandler(this), Fetch]);
    manager.useCache(new SimpleCacheHandler());

    const url1 = buildBaseURL({ resourcePath: 'users/1' });
    const url2 = buildBaseURL({ resourcePath: 'users/2' });
    const url3 = buildBaseURL({ resourcePath: 'users/3' });

    await GET(this, 'users/1', () => ({
      data: [{ id: '1', type: 'user', attributes: { name: 'Chris Thoburn' } }],
      links: {
        self: url1,
        next: url2,
      },
    }));

    await GET(this, 'users/1', () => ({
      data: [{ id: '1', type: 'user', attributes: { name: 'Chris Thoburn' } }],
      links: {
        self: url1,
        next: url3,
      },
    }));

    await GET(this, 'users/2', () => ({
      data: [{ id: '2', type: 'user', attributes: { name: 'Leo Euclides' } }],
      links: {
        self: url2,
      },
    }));

    await GET(this, 'users/3', () => ({
      data: [{ id: '3', type: 'user', attributes: { name: 'Godfrey Chan' } }],
      links: {
        self: url3,
      },
    }));

    const request = manager.request<CollectionResourceDataDocument<UserResource>>({ url: url1, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;
    // Allow the pagination state to install the initial pagination links.
    await Promise.resolve();

    assert.true(paginationState.hasNext, 'the initial response exposes the original next page');

    const reloadRequest = manager.request<CollectionResourceDataDocument<UserResource>>({
      url: url1,
      method: 'GET',
      cacheOptions: { reload: true },
    });
    const reloaded = await reloadRequest;

    assert.equal(
      (reloaded.content.links as PaginationLinks).next,
      url3,
      'the reloaded response replaces the next link with page 3'
    );

    await paginationState.adoptPage(reloadRequest);

    const result = await paginationState.loadNext();

    assert.equal(result?.data[0]?.id, '3', 'loadNext follows the refreshed next link instead of the stale one');
  });
});
