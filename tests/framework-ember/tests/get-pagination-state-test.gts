import { Fetch, RequestManager } from '@warp-drive/core';
import type { CacheHandler, Future, NextFn } from '@warp-drive/core/request';
import type { RequestContext, StructuredDataDocument } from '@warp-drive/core/types/request';
import type { CollectionResourceDataDocument } from '@warp-drive/core/types/spec/document';
import type { RenderingTestContext } from '@warp-drive/diagnostic/ember';
import { module, setupRenderingTest, test as _test } from '@warp-drive/diagnostic/ember';
import { getPaginationState } from '@warp-drive/ember';
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

type PaginatedUserResource = CollectionResourceDataDocument<UserResource> & {
  meta?: {
    page?: number;
    currentPage?: number;
    totalPages?: number;
  };
};

// our tests use a rendering test context and add manager to it
interface LocalTestContext extends RenderingTestContext {
  manager: RequestManager;
}
type DiagnosticTest = Parameters<typeof _test<LocalTestContext>>[1];
function test(name: string, callback: DiagnosticTest): void {
  return _test<LocalTestContext>(name, callback);
}

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

const users: UserResource[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  type: 'user',
  attributes: {
    name: `User ${index + 1}`,
  },
}));

async function mockGETSuccess(context: LocalTestContext): Promise<string> {
  const url = buildBaseURL({ resourcePath: 'users/1' });

  await GET(context, 'users/1', () => ({
    data: users.slice(0, 10),
    links: {
      prev: null,
      self: url,
      next: null,
    },
  }));

  return url;
}

async function mockGETFailure(context: LocalTestContext): Promise<string> {
  const url = buildBaseURL({ resourcePath: 'users/1' });

  await GET(context, 'users/1', () => ({
      errors: [
        {
          status: '404',
          title: 'Not Found',
          detail: 'Page not found.',
        },
      ],
      links: {
        self: url,
      },
    }),
    {
      status: 404,
      statusText: 'Not Found',
    }
  );

  return url;
}

module<LocalTestContext>('Integration | get-pagination-state', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const manager = new RequestManager();
    manager.use([new MockServerHandler(this), Fetch]);
    manager.useCache(new SimpleCacheHandler());

    this.manager = manager;
  });

  test('It returns a pagination state that updates on success', async function (assert) {
    const url = await mockGETSuccess(this);

    const request = this.manager.request<PaginatedUserResource>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    assert.true(paginationState.isLoading, 'The pagination state is loading');
    assert.false(paginationState.isSuccess, 'The pagination state is not successful');
    assert.false(paginationState.isError, 'The pagination state is not an error');
    assert.equal(Array.from(paginationState.data).length, 0, 'No data loaded yet');

    await request;

    assert.true(paginationState.isSuccess, 'The pagination state is successful');
    assert.false(paginationState.isLoading, 'The pagination state is no longer loading');
    assert.false(paginationState.isError, 'The pagination state is not an error');
    assert.equal(Array.from(paginationState.data).length, 10, 'Data contains 10 items');
    assert.equal(Array.from(paginationState.pages).length, 1, '1 page exist after load');
  });

  test('It returns a pagination state that manages pages correctly', async function (assert) {
    const url = await mockGETSuccess(this);

    const request = this.manager.request<PaginatedUserResource>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;

    assert.equal(paginationState.initialPage, paginationState.activePage, 'Initial page is the active page');
    assert.true(paginationState.initialPage.isSuccess, 'Initial page is successful');
    assert.false(paginationState.initialPage.isLoading, 'Initial page is not loading');
    assert.false(paginationState.initialPage.isError, 'Initial page is not an error');
  });

  test('It returns a pagination state that updates on failure', async function (assert) {
    const url = await mockGETFailure(this);
    const request = this.manager.request<PaginatedUserResource>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    assert.true(paginationState.isLoading, 'The pagination state is loading');
    assert.false(paginationState.isSuccess, 'The pagination state is not successful');
    assert.false(paginationState.isError, 'The pagination state is not an error');
    assert.equal(Array.from(paginationState.pages).length, 1, 'Initial page exists');
    assert.equal(Array.from(paginationState.data).length, 0, 'No data loaded yet');

    try {
      await request;
    } catch {
      // ignore the error
    }

    assert.false(paginationState.isSuccess, 'The pagination state is not successful');
    assert.false(paginationState.isLoading, 'The pagination state is no longer loading');
    assert.true(paginationState.isError, 'The pagination state is an error');
    assert.equal(Array.from(paginationState.pages).length, 1, 'Page still exists after error');
    assert.equal(Array.from(paginationState.data).length, 0, 'No data after error');
    assert.true(paginationState.initialPage.isError, 'Initial page is in error state');
  });

  test('It handles next page navigation correctly', async function (assert) {
    const url1 = buildBaseURL({ resourcePath: 'users/1' });
    const url2 = buildBaseURL({ resourcePath: 'users/2' });

    await GET(this, 'users/1', () => ({
      data: users.slice(0, 3),
      links: {
        prev: null,
        self: url1,
        next: url2,
      },
    }));

    await GET(this, 'users/2', () => ({
      data: users.slice(3, 6),
      links: {
        prev: url1,
        self: url2,
        next: null,
      },
    }));

    const request = this.manager.request<PaginatedUserResource>({ url: url1, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;

    assert.equal(Array.from(paginationState.pages).length, 2, '2 pages loaded');
    assert.equal(Array.from(paginationState.data).length, 3, '3 items loaded');

    const activePage = paginationState.activePage;
    const nextLink = activePage.nextLink;
    assert.true(Boolean(nextLink), 'Next link exists');

    if (!nextLink) {
      return;
    }

    const nextPageState = paginationState.getPageState(nextLink);
    const nextRequest = this.manager.request<PaginatedUserResource>({ url: nextLink, method: 'GET' });
    const nextPage = nextPageState.load(nextRequest);

    paginationState.activatePage(nextPageState);

    await nextPage;

    assert.equal(Array.from(paginationState.pages).length, 2, '2 pages are loaded');
    assert.equal(Array.from(paginationState.data).length, 6, '6 items loaded');
    assert.true(paginationState.isSuccess, 'Still in success state');
    assert.false(paginationState.isLoading, 'Not in loading state');
    assert.false(paginationState.isError, 'Not in error state');
  });

  test('It returns edge self links when first/last pages are placeholders', async function (assert) {
    const url1 = buildBaseURL({ resourcePath: 'users/1' });
    const url2 = buildBaseURL({ resourcePath: 'users/2' });
    const url3 = buildBaseURL({ resourcePath: 'users/3' });

    await GET(this, 'users/2', () => ({
      data: [users[1]],
      links: {
        prev: url1,
        self: url2,
        next: url3,
      },
    }));

    const request = this.manager.request<PaginatedUserResource>({ url: url2, method: 'GET' });
    const paginationState = getPaginationState(request);
    await request;

    assert.equal(paginationState.prev, url1, 'Prev points at placeholder self link');
    assert.equal(paginationState.next, url3, 'Next points at placeholder self link');
    assert.equal(paginationState.prevRequest, null, 'Prev request is null until placeholder is loaded');
    assert.equal(paginationState.nextRequest, null, 'Next request is null until placeholder is loaded');
  });

  test('It handles pagination when no next page exists', async function (assert) {
    const url = await mockGETSuccess(this);

    const request = this.manager.request<PaginatedUserResource>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;

    const activePage = paginationState.activePage;
    assert.equal(activePage.nextLink, null, 'Has no next link when on last page');
    assert.equal(activePage.next, null, 'Has no next page state when on last page');

    assert.false(Boolean(activePage.nextLink), 'Has no next page available when on last page');
  });

  test('It caches pagination state and deduplicates page states by link', async function (assert) {
    const url1 = buildBaseURL({ resourcePath: 'users/1' });
    const url2 = buildBaseURL({ resourcePath: 'users/2' });

    await GET(this, 'users/1', () => ({
      data: [users[0]],
      links: {
        prev: null,
        self: url1,
        next: url2,
      },
    }));

    await GET(this, 'users/2', () => ({
      data: [users[1]],
      links: {
        prev: url1,
        self: url2,
        next: null,
      },
    }));

    const request = this.manager.request<PaginatedUserResource>({ url: url1, method: 'GET' });
    const paginationState = getPaginationState(request);
    const samePaginationState = getPaginationState(request);

    assert.equal(paginationState, samePaginationState, 'The pagination state instance is cached by request');

    await request;

    const pageFromSelfLink = paginationState.getPageState(url1);
    assert.equal(pageFromSelfLink, paginationState.activePage, 'Self link resolves to the active page instance');

    const placeholder = paginationState.getPageState(url2);
    assert.false(placeholder.isLoaded, 'The next page starts as a placeholder');

    const nextRequest = this.manager.request<PaginatedUserResource>({ url: url2, method: 'GET' });
    await placeholder.load(nextRequest);

    const loadedAgain = paginationState.getPageState(url2);
    assert.equal(loadedAgain, placeholder, 'Link lookup returns the same page instance after it loads');
  });

  test('It infers pageNumber and totalPages from meta.currentPage when totalPages is missing', async function (assert) {
    const url = buildBaseURL({ resourcePath: 'users/3' });

    await GET(this, 'users/3', () => ({
      data: [users[2]],
      links: {
        prev: buildBaseURL({ resourcePath: 'users/2' }),
        self: url,
        next: null,
      },
      meta: {
        currentPage: 3,
      },
    }));

    const request = this.manager.request<PaginatedUserResource>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;

    assert.equal(paginationState.activePage.pageNumber, 3, 'Uses currentPage when page is absent');
    assert.equal(paginationState.totalPages, 3, 'Falls back totalPages to pageNumber when absent');
  });

  test('It falls back pageNumber and totalPages to 1 when meta page values are missing', async function (assert) {
    const url = buildBaseURL({ resourcePath: 'users/1' });

    await GET(this, 'users/1', () => ({
      data: [users[0]],
      links: {
        prev: null,
        self: url,
        next: null,
      },
      meta: {},
    }));

    const request = this.manager.request<PaginatedUserResource>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;

    assert.equal(paginationState.activePage.pageNumber, 1, 'Defaults pageNumber to 1');
    assert.equal(paginationState.totalPages, 1, 'Defaults totalPages to the pageNumber');
  });

  test('It supports object-style links and resolves first and last page placeholders', async function (assert) {
    const url1 = buildBaseURL({ resourcePath: 'users/1' });
    const url2 = buildBaseURL({ resourcePath: 'users/2' });
    const url3 = buildBaseURL({ resourcePath: 'users/3' });

    await GET(this, 'users/2', () => ({
      data: [users[1]],
      links: {
        first: { href: url1 },
        prev: { href: url1 },
        self: { href: url2 },
        next: { href: url3 },
        last: { href: url3 },
      },
    }));

    const request = this.manager.request<PaginatedUserResource>({ url: url2, method: 'GET' });
    const paginationState = getPaginationState(request);
    await request;

    const activePage = paginationState.activePage;
    assert.equal(activePage.firstLink, url1, 'Extracts first link from object format');
    assert.equal(activePage.lastLink, url3, 'Extracts last link from object format');

    const firstPage = activePage.first;
    const lastPage = activePage.last;
    assert.true(Boolean(firstPage), 'First page placeholder is resolvable');
    assert.true(Boolean(lastPage), 'Last page placeholder is resolvable');
    assert.equal(firstPage?.selfLink, url1, 'First placeholder carries its self link');
    assert.equal(lastPage?.selfLink, url3, 'Last placeholder carries its self link');
  });

  test('It guards pages iteration against cyclic next links', async function (assert) {
    const url1 = buildBaseURL({ resourcePath: 'users/1' });
    const url2 = buildBaseURL({ resourcePath: 'users/2' });

    await GET(this, 'users/1', () => ({
      data: [users[0]],
      links: {
        prev: null,
        self: url1,
        next: url2,
      },
    }));

    const request = this.manager.request<PaginatedUserResource>({ url: url1, method: 'GET' });
    const paginationState = getPaginationState(request);
    await request;

    const nextPage = paginationState.activePage.next;
    assert.true(Boolean(nextPage), 'Next placeholder exists');
    if (!nextPage) {
      return;
    }

    nextPage.updateLinks({ next: url1 });
    const pages = Array.from(paginationState.pages);

    assert.equal(pages.length, 2, 'Pages iteration stops when it sees a cycle');
    assert.equal(pages[0]?.selfLink, url1, 'First page is the initial page');
    assert.equal(pages[1]?.selfLink, url2, 'Second page is the placeholder page');
  });

  test('It returns correct navigation helpers', async function (assert) {
    const url = buildBaseURL({ resourcePath: 'users/2' });

    await GET(this, 'users/2', () => ({
      data: users.slice(3, 3),
      links: {
        prev: buildBaseURL({ resourcePath: 'users/1' }),
        self: url,
        next: buildBaseURL({ resourcePath: 'users/3' }),
      },
    }));

    await GET(this, 'users/1', () => ({
      data: users.slice(0, 3),
      links: {
        prev: null,
        self: buildBaseURL({ resourcePath: 'users/1' }),
        next: url,
      },
    }));

    await GET(this, 'users/3', () => ({
      data: users.slice(6, 3),
      links: {
        prev: url,
        self: buildBaseURL({ resourcePath: 'users/3' }),
        next: null,
      },
    }));

    const request = this.manager.request<PaginatedUserResource>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    await request;

    const activePage = paginationState.activePage;
    assert.true(Boolean(activePage.nextLink), 'Has next link when not on last page');
    assert.true(Boolean(activePage.prevLink), 'Has prev link when not on first page');

    const prevLink = activePage.prevLink;
    assert.true(Boolean(prevLink), 'Has prev link when not on first page');
    if (!prevLink) {
      return;
    }

    const prevPageState = paginationState.getPageState(prevLink);
    const prevRequest = this.manager.request<PaginatedUserResource>({ url: prevLink, method: 'GET' });
    const prevPage = prevPageState.load(prevRequest);

    const nextLink = activePage.nextLink;
    assert.true(Boolean(nextLink), 'Has next link when not on last page');
    if (!nextLink) {
      return;
    }

    const nextPageState = paginationState.getPageState(nextLink);
    const nextRequest = this.manager.request<PaginatedUserResource>({ url: nextLink, method: 'GET' });
    const nextPage = nextPageState.load(nextRequest);

    assert.true(Boolean(paginationState.prevRequest), 'Has prev request when not on first page');
    assert.true(Boolean(prevPage), 'Prev page');
    assert.true(Boolean(paginationState.nextRequest), 'Has next request when not on last page');
    assert.true(Boolean(nextPage), 'Next page');
  });

  test('It handles abort correctly', async function (assert) {
    const url = await mockGETSuccess(this);

    const request = this.manager.request<PaginatedUserResource>({ url, method: 'GET' });
    const paginationState = getPaginationState(request);

    assert.true(paginationState.isLoading, 'The pagination state is loading');
    assert.false(paginationState.isSuccess, 'The pagination state is not successful');
    assert.false(paginationState.isError, 'The pagination state is not an error');

    request.abort();

    try {
      await request;
    } catch {
      // ignore the error
    }

    assert.false(paginationState.isSuccess, 'The pagination state is not successful');
    assert.false(paginationState.isLoading, 'The pagination state is no longer loading');
    assert.true(paginationState.isCancelled, 'The pagination state is cancelled');
    assert.true(paginationState.isError, 'The pagination state is an error');
    assert.equal(Array.from(paginationState.pages).length, 1, 'Page still exists after abort');
    assert.equal(Array.from(paginationState.data).length, 0, 'No data after abort');
    assert.true(Boolean(paginationState.reason), 'The pagination state includes an abort reason');
    assert.satisfies(
      paginationState.reason,
      {
        name: 'AbortError',
        statusText: 'Aborted',
      },
      'The reason identifies the abort'
    );
    assert.true(Boolean(paginationState.loadingState), 'The loading state is available on pagination state');
  });
});
