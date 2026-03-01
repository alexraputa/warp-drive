import { assert } from '@warp-drive/core/build-config/macros';

import type { PaginationState } from './pagination-state.ts';
import { memoized } from './reactivity/signal.ts';

const PaginationLinksCache = new WeakMap<object, PaginationLinks>();

export class RealPaginationLink {
  readonly isReal = true as const;

  readonly url: string;
  readonly index: number;
  readonly text: string;
  distanceFromActiveIndex: number;
  isCurrent: boolean;

  constructor(url: string, index: number, isCurrent: boolean, distanceFromActiveIndex: number) {
    this.url = url;
    this.index = index;
    this.text = `${index}`;
    this.isCurrent = isCurrent;
    this.distanceFromActiveIndex = distanceFromActiveIndex;
  }
}

export class PlaceholderPaginationLink {
  readonly isReal = false as const;

  indexRange: [start: number, end: number];
  distanceFromActiveIndex: number;

  text = '.';

  constructor(index: [start: number, end: number], distanceFromActiveIndex: number) {
    this.indexRange = index;
    this.distanceFromActiveIndex = distanceFromActiveIndex;
  }

  get rangeSize(): number {
    return this.indexRange[1] - this.indexRange[0] + 1;
  }

  _mergeRange(newRange: [start: number, end: number], newActiveIndex: number): void {
    const [oldStart, oldEnd] = this.indexRange;
    const [newStart, newEnd] = newRange;
    const mergedRange: [start: number, end: number] = [Math.min(oldStart, newStart), Math.max(oldEnd, newEnd)];
    this.indexRange = mergedRange;
    this.distanceFromActiveIndex = Math.min(
      Math.abs(mergedRange[0] - newActiveIndex),
      Math.abs(mergedRange[1] - newActiveIndex)
    );
  }
}

function getPaginationLink(
  existingLink: RealPaginationLink | PlaceholderPaginationLink | null,
  index: number,
  currentPage: number,
  url: string | null
): PaginationLink {
  const isCurrent = index === currentPage;
  const distanceFromActiveIndex = Math.abs(index - currentPage);
  if (existingLink?.isReal) {
    assert('Found existing real link with a different URL', !url || !existingLink.url || url === existingLink.url);
    return new RealPaginationLink(url ?? existingLink.url, index, isCurrent, distanceFromActiveIndex);
  } else if (url) {
    return new RealPaginationLink(url, index, isCurrent, distanceFromActiveIndex);
  } else {
    return new PlaceholderPaginationLink([index, index], distanceFromActiveIndex);
  }
}

export type PaginationLink = RealPaginationLink | PlaceholderPaginationLink;

export class PaginationLinks<RT = unknown, E = unknown> {
  declare paginationState: PaginationState<RT, E>;

  private _links: PaginationLink[] = [];

  constructor(paginationState: PaginationState<RT, E>) {
    this.paginationState = paginationState;
  }

  /** All available links and placeholders */
  @memoized
  get links(): PaginationLink[] {
    const state = this.paginationState;

    const { activePage } = state;
    if (!activePage?.isSuccess) {
      return this._links;
    }

    const { totalPages } = state;
    if (totalPages < 1) {
      return this._links;
    }

    const { pageNumber, selfLink, firstLink, lastLink, prevLink, nextLink } = activePage;

    const links: PaginationLink[] = [];
    const existingLinks = this._links ?? [];

    let prevPageLink: PaginationLink | null = null;

    const pushOrMerge = (currPageLink: PaginationLink) => {
      if (!prevPageLink || prevPageLink.isReal || currPageLink.isReal) {
        prevPageLink = currPageLink;
        links.push(currPageLink);
        return;
      }
      prevPageLink._mergeRange(currPageLink.indexRange, pageNumber);
    };

    for (let index = 1; index <= totalPages; index++) {
      const existingRealLink =
        existingLinks.find((link): link is RealPaginationLink => link.isReal && link.index === index) ?? null;

      // First page
      if (firstLink && index === 1) {
        const currPageLink = getPaginationLink(existingRealLink, index, pageNumber, firstLink);
        pushOrMerge(currPageLink);
        continue;
      }
      // Previous page
      if (prevLink && index === pageNumber - 1) {
        const currPageLink = getPaginationLink(existingRealLink, index, pageNumber, prevLink);
        pushOrMerge(currPageLink);
        continue;
      }
      // Current Page
      if (index === pageNumber) {
        const currPageLink = getPaginationLink(existingRealLink, index, pageNumber, selfLink);
        pushOrMerge(currPageLink);
        continue;
      }
      // Next Page
      if (nextLink && index === pageNumber + 1) {
        const currPageLink = getPaginationLink(existingRealLink, index, pageNumber, nextLink);
        pushOrMerge(currPageLink);
        continue;
      }
      // Last page
      if (lastLink && index === totalPages) {
        const currPageLink = getPaginationLink(existingRealLink, index, pageNumber, lastLink);
        pushOrMerge(currPageLink);
        continue;
      }
      // Placeholder
      const currPageLink = getPaginationLink(existingRealLink, index, pageNumber, null);
      pushOrMerge(currPageLink);
    }

    return (this._links = links);
  }
}

export function getPaginationLinks<RT, E>(
  state: PaginationState<RT, E>
): Readonly<PaginationLinks<RT, E>> {
  const key = state;
  let links = PaginationLinksCache.get(key) as PaginationLinks<RT, E> | undefined;

  if (!links) {
    links = new PaginationLinks(state);
    PaginationLinksCache.set(key, links as PaginationLinks);
  }

  return links;
}
