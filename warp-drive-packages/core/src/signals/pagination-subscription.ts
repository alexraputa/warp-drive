import type { RequestManager, Store } from '../index.ts';
import type { Future } from '../request.ts';
import { memoized } from './-private.ts';
import type { PaginationState } from './pagination-state.ts';
import { getPaginationState } from './pagination-state.ts';
import {
  type ContentFeatures as RequestContentFeatures,
  createRequestSubscription,
  DISPOSE,
  type RecoveryFeatures,
  type RequestSubscription,
  type SubscriptionArgs,
} from './request-subscription.ts';

export interface PaginationContentFeatures<RT> extends RequestContentFeatures<RT> {
  loadNext: () => Promise<void>;
  loadPrev: () => Promise<void>;
  loadPage: (url: string) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PaginationSubscription<RT, E> {
  /**
   * The method to call when the component this subscription is attached to
   * unmounts.
   */
  [DISPOSE](): void;
  store: Store | RequestManager;
}

export type PaginationSubscriptionArgs<RT, E> = SubscriptionArgs<RT, E>;

/**
 * A reactive class
 *
 * @hideconstructor
 */
export class PaginationSubscription<RT, E> {
  /** @internal */
  declare private isDestroyed: boolean;
  /** @internal */
  declare private _args: PaginationSubscriptionArgs<RT, E>;
  /** @internal */
  declare store: Store | RequestManager;

  constructor(store: Store | RequestManager, args: PaginationSubscriptionArgs<RT, E>) {
    this._args = args;
    this.store = store;
    this.isDestroyed = false;
    this[DISPOSE] = _DISPOSE;
  }

  @memoized
  get isIdle(): boolean {
    return this._requestSubscription.isIdle;
  }

  /**
   * Retry the request, reloading it from the server.
   */
  retry = async (): Promise<void> => {
    await this._requestSubscription.retry();
  };

  /**
   * Refresh the request, updating it in the background.
   */
  refresh = async (): Promise<void> => {
    await this._requestSubscription.refresh();
  };

  /**
   * Loads the prev page based on links.
   */
  loadPrev = async (): Promise<void> => {
    const { prev } = this.paginationState;
    if (prev) {
      await this.loadPage(prev);
    }
  };

  /**
   * Loads the next page based on links.
   */
  loadNext = async (): Promise<void> => {
    const { next } = this.paginationState;
    if (next) {
      await this.loadPage(next);
    }
  };

  /**
   * Loads a specific page by its URL.
   */
  loadPage = async (url: string): Promise<void> => {
    const paginationState = this.paginationState;
    const page = paginationState.getPageState(url);
    paginationState.activatePage(page);
    if (!page.isLoaded) {
      const request = this.store.request({ method: 'GET', url });
      await page.load(request);
    }
  };

  /**
   * Error features to yield to the error slot of a component
   */
  @memoized
  get errorFeatures(): RecoveryFeatures {
    return {
      isHidden: this._requestSubscription.isHidden,
      isOnline: this._requestSubscription.isOnline,
      retry: this._requestSubscription.retry,
    };
  }

  /**
   * Content features to yield to the content slot of a component
   */
  @memoized
  get contentFeatures(): PaginationContentFeatures<RT> {
    const contentFeatures = this._requestSubscription.contentFeatures;
    const feat: PaginationContentFeatures<RT> = {
      ...contentFeatures,
      loadPrev: this.loadPrev,
      loadNext: this.loadNext,
      loadPage: this.loadPage,
    };

    if (feat.isRefreshing) {
      feat.abort = () => {
        contentFeatures.latestRequest?.abort();
      };
    }

    return feat;
  }

  /**
   * @internal
   */
  @memoized
  get _requestSubscription(): RequestSubscription<RT, E> {
    return createRequestSubscription(this.store, this._args);
  }

  @memoized
  get request(): Future<RT> {
    return this._requestSubscription.request;
  }

  @memoized
  get paginationState(): PaginationState<RT, E> {
    return getPaginationState<RT, E>(this.request);
  }
}

export function createPaginationSubscription<RT, E>(
  store: Store | RequestManager,
  args: SubscriptionArgs<RT, E>
): PaginationSubscription<RT, E> {
  return new PaginationSubscription(store, args);
}

interface PrivatePaginationSubscription<RT, E> {
  isDestroyed: boolean;
  _requestSubscription: RequestSubscription<RT, E>;
}

function upgradeSubscription<RT, E>(sub: unknown): PrivatePaginationSubscription<RT, E> {
  return sub as PrivatePaginationSubscription<RT, E>;
}

function _DISPOSE<RT, E>(this: PaginationSubscription<RT, E>) {
  const self = upgradeSubscription<RT, E>(this);
  self.isDestroyed = true;
  self._requestSubscription[DISPOSE]();
}
