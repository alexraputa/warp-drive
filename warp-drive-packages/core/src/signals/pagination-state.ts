/**
 * @module @warp-drive/ember
 */
import { assert } from '@warp-drive/core/build-config/macros';

import type { ReactiveDocument } from '../reactive.ts';
import type { Future } from '../request.ts';
import type { StructuredErrorDocument } from '../types/request.ts';
import type { Link } from '../types/spec/json-api-raw.ts';
import { memoized, signal } from './reactivity/signal.ts';
import type { RequestLoadingState, RequestState } from './request-state.ts';
import { getRequestState } from './request-state.ts';

const PaginationCache = new WeakMap<Future<unknown>, PaginationState>();

type PaginationItem<RT> = RT extends { data: Array<infer T> } ? T : unknown;

export function getHref(link?: Link | null): string | null {
  if (!link) {
    return null;
  }
  if (typeof link === 'string') {
    return link;
  }
  return link.href;
}

type Links = {
  prev?: string | null;
  next?: string | null;
  first?: string | null;
  last?: string | null;
};

export class PageState<RT = unknown, E = unknown> {
  declare manager: PaginationState<RT, E>;
  @signal declare request: Future<RT> | null;
  @signal declare state: Readonly<RequestState<RT, StructuredErrorDocument<E>>> | null;
  @signal declare selfLink: string | null;
  @signal declare prevLink: string | null;
  @signal declare nextLink: string | null;
  @signal declare firstLink: string | null;
  @signal declare lastLink: string | null;
  @signal declare pageNumber: number;

  constructor(manager: PaginationState<RT, E>, futureOrLink: Future<RT> | string) {
    this.manager = manager;
    this.request = null;
    this.state = null;
    this.selfLink = null;
    this.prevLink = null;
    this.nextLink = null;
    this.firstLink = null;
    this.lastLink = null;
    this.pageNumber = 0;

    if (typeof futureOrLink === 'string') {
      this.selfLink = futureOrLink;
    } else {
      void this.load(futureOrLink);
    }
  }

  @memoized
  get value(): ReactiveDocument<RT> | null {
    return (this.state?.value as ReactiveDocument<RT> | null) ?? null;
  }

  @memoized
  get data(): ReadonlyArray<PaginationItem<RT>> {
    return (this.value?.data as PaginationItem<RT>[] | undefined) ?? [];
  }

  @memoized
  get isRequested(): boolean {
    return Boolean(this.state);
  }

  @memoized
  get isLoaded(): boolean {
    return this.isSuccess || this.isError;
  }

  @memoized
  get isLoading(): boolean {
    return Boolean(this.state?.isLoading);
  }

  @memoized
  get isSuccess(): boolean {
    return Boolean(this.state?.isSuccess);
  }

  @memoized
  get isCancelled(): boolean {
    return Boolean(this.state?.isCancelled);
  }

  @memoized
  get isError(): boolean {
    return Boolean(this.state?.isError);
  }

  @memoized
  get reason(): StructuredErrorDocument<E> | null {
    return this.state?.reason ?? null;
  }

  @memoized
  get prev(): PageState<RT, E> | null {
    const url = this.prevLink;
    return url ? this.manager.getPageState(url) : null;
  }

  @memoized
  get next(): PageState<RT, E> | null {
    const url = this.nextLink;
    return url ? this.manager.getPageState(url) : null;
  }

  @memoized
  get first(): PageState<RT, E> | null {
    const url = this.firstLink;
    return url ? this.manager.getPageState(url) : null;
  }

  @memoized
  get last(): PageState<RT, E> | null {
    const url = this.lastLink;
    return url ? this.manager.getPageState(url) : null;
  }

  load = async (request: Future<unknown>): Promise<ReactiveDocument<RT> | null> => {
    try {
      this.request = request as Future<RT>;
      this.state = getRequestState<RT, E>(this.request);
      const value = await this.request;
      const content = value.content as ReactiveDocument<RT>;

      const self = getHref(content?.links?.self);
      assert('Expected the page to have a self link', self);

      if (this.selfLink && this.selfLink !== self) {
        this.manager.pagesCache.delete(this.selfLink);
      }
      this.selfLink = self;
      this.manager.pagesCache.set(self, this);

      const next = getHref(content?.links?.next);
      if (next) {
        this.nextLink = next;
        const nextPage = this.manager.getPageState(next);
        nextPage.updateLinks({ prev: self });
      }

      const prev = getHref(content?.links?.prev);
      if (prev) {
        const prevPage = this.manager.getPageState(prev);
        this.prevLink = prev;
        prevPage.updateLinks({ next: self });
      }

      const first = getHref(content?.links?.first);
      if (first) {
        this.firstLink = first;
      }

      const last = getHref(content?.links?.last);
      if (last) {
        this.lastLink = last;
      }

      const pageNumber = this.getPageNumber(content);
      if (pageNumber) {
        this.pageNumber = pageNumber;
      } else if (!this.pageNumber) {
        this.pageNumber = 1;
      }

      const totalPages = this.getTotalPages(content);
      if (totalPages) {
        this.manager.totalPages = totalPages;
      } else if (!this.manager.totalPages && this.pageNumber > 0) {
        this.manager.totalPages = this.pageNumber;
      }

      return content;
    } catch {
      return null;
    }
  };

  getPageNumber = (document: ReactiveDocument<unknown>): number | null => {
    const currentPage = Number(document.meta?.page ?? document.meta?.currentPage ?? 0);
    return Number.isFinite(currentPage) && currentPage > 0 ? currentPage : null;
  };

  getTotalPages = (document: ReactiveDocument<unknown>): number | null => {
    const totalPages = Number(document.meta?.totalPages ?? 0);
    return Number.isFinite(totalPages) && totalPages > 0 ? totalPages : null;
  };

  updateLinks = ({ prev, next, first, last }: Links): void => {
    if (prev !== undefined) {
      this.prevLink = prev;
    }
    if (next !== undefined) {
      this.nextLink = next;
    }
    if (first !== undefined) {
      this.firstLink = first;
    }
    if (last !== undefined) {
      this.lastLink = last;
    }
  };

  setPageNumber = (pageNumber: number): void => {
    if (!this.pageNumber && pageNumber > 0) {
      this.pageNumber = pageNumber;
    }
  };
}

export class PaginationState<RT = unknown, E = unknown> {
  @signal declare initialPage: Readonly<PageState<RT, E>>;
  @signal declare activePage: Readonly<PageState<RT, E>>;
  @signal declare totalPages: number;
  declare pagesCache: Map<string, PageState<RT, E>>;

  constructor(request: Future<RT>) {
    this.pagesCache = new Map<string, PageState<RT, E>>();
    this.initialPage = new PageState(this, request);
    this.activePage = this.initialPage;
    this.totalPages = 0;
  }

  @memoized
  get isLoading(): boolean {
    return this.initialPage.isLoading;
  }

  @memoized
  get isSuccess(): boolean {
    return this.initialPage.isSuccess;
  }

  @memoized
  get isError(): boolean {
    return this.initialPage.isError;
  }

  @memoized
  get isCancelled(): boolean {
    return this.initialPage.isCancelled;
  }

  @memoized
  get reason(): StructuredErrorDocument<E> | null {
    return this.initialPage.reason;
  }

  @memoized
  get loadingState(): RequestLoadingState | null {
    return this.initialPage.state?.loadingState ?? null;
  }

  @memoized
  get firstPage(): Readonly<PageState<RT, E>> {
    let page = this.activePage;
    while (page && page.prev) {
      page = page.prev;
    }
    return page;
  }

  @memoized
  get lastPage(): Readonly<PageState<RT, E>> {
    let page = this.activePage;
    while (page && page.next) {
      page = page.next;
    }
    return page;
  }

  @memoized
  get prev(): string | null {
    const first = this.firstPage;
    return first.isLoaded ? first.prevLink : first.selfLink;
  }

  @memoized
  get next(): string | null {
    const last = this.lastPage;
    return last.isLoaded ? last.nextLink : last.selfLink;
  }

  @memoized
  get activePageRequest(): Future<RT> | null {
    return this.activePage.request;
  }

  @memoized
  get prevRequest(): Future<RT> | null {
    return this.firstPage.request;
  }

  @memoized
  get nextRequest(): Future<RT> | null {
    return this.lastPage.request;
  }

  activatePage = (page: Readonly<PageState<RT, E>>): void => {
    this.activePage = page;
  };

  getPageState = (futureOrLink: Future<RT> | string): Readonly<PageState<RT, E>> => {
    const key =
      typeof futureOrLink === 'string'
        ? futureOrLink
        : futureOrLink.lid
          ? `lid:${String(futureOrLink.lid)}`
          : `request:${String(futureOrLink.id)}`;
    let state = this.pagesCache.get(key);

    if (!state) {
      state = new PageState(this, futureOrLink);
      this.pagesCache.set(key, state);
    }

    return state;
  };

  @memoized
  get pages(): ReadonlyArray<Readonly<PageState<RT, E>>> {
    const pages: Array<Readonly<PageState<RT, E>>> = [];
    const seen = new Set<Readonly<PageState<RT, E>>>();
    let page: Readonly<PageState<RT, E>> | null = this.firstPage;

    while (page && !seen.has(page)) {
      seen.add(page);
      pages.push(page);
      page = page.next;
    }

    return pages;
  }

  @memoized
  get data(): ReadonlyArray<PaginationItem<RT>> {
    const data: PaginationItem<RT>[] = [];

    for (const page of this.pages) {
      if (page.data) {
        data.push(...page.data);
      }
    }

    return data;
  }
}

/**
 * Get the pagination state for a given request, this will return the same
 * PaginationState instance for the same request, even if the future is
 * a different instance based on the cache identity of the request.
 *
 * ```ts
 * import { getPaginationState } from '@warp-drive/ember';
 *
 * const future = store.request(query('user', { page: { size: 10 } }));
 * const state = getPaginationState(future);
 * ```
 *
 * @public
 * @static
 * @for @warp-drive/ember
 * @param future
 * @return {PaginationState}
 */
export function getPaginationState<RT, E>(future: Future<RT>): Readonly<PaginationState<RT, E>> {
  const key = future;
  let state = PaginationCache.get(key) as PaginationState<RT, E> | undefined;

  if (!state) {
    state = new PaginationState<RT, E>(future);
    PaginationCache.set(key, state as PaginationState);
  }

  return state;
}
