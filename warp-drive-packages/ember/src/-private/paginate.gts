import { service } from '@ember/service';
import Component from '@glimmer/component';

import { importSync, macroCondition, moduleExists } from '@embroider/macros';

import type { RequestManager, Store } from '@warp-drive/core';
import { assert } from '@warp-drive/core/build-config/macros';
import type { PaginationState, RequestLoadingState } from '@warp-drive/core/reactive';
import { createPaginationSubscription } from '@warp-drive/core/reactive';
import type {
  ContentFeatures as RequestContentFeatures,
  RecoveryFeatures,
  SubscriptionArgs,
} from '@warp-drive/core/signals/-leaked';
import { DISPOSE } from '@warp-drive/core/signals/-leaked';
import type { StructuredErrorDocument } from '@warp-drive/core/types/request';

import { and, Throw } from './await.gts';

function notNull(x: null): never;
function notNull<T>(x: T): Exclude<T, null>;
function notNull<T>(x: T | null) {
  assert('Expected a non-null value, but got null', x !== null);
  return x;
}

const not = (x: unknown) => !x;
const IdleBlockMissingError = new Error(
  'No idle block provided for <Paginate> component, and no query or request was provided.'
);

let consume = service;
if (macroCondition(moduleExists('ember-provide-consume-context'))) {
  const { consume: contextConsume } = importSync('ember-provide-consume-context') as { consume: typeof service };
  consume = contextConsume;
}

type PaginationContentFeatures<RT> = RequestContentFeatures<RT> & {
  loadNext: () => Promise<void>;
  loadPrev: () => Promise<void>;
  loadPage: (url: string) => Promise<void>;
};

type PaginationSubscriptionState<RT, E> = {
  store: Store | RequestManager;
  isIdle: boolean;
  paginationState: PaginationState<RT, E>;
  contentFeatures: PaginationContentFeatures<RT>;
  errorFeatures: RecoveryFeatures;
  [DISPOSE](): void;
};

export interface EmberPaginateArgs<RT, E> extends SubscriptionArgs<RT, E> {
  /**
   * The request to monitor. This should be a `Future` instance returned
   * by either the `store.request` or `store.requestManager.request` methods.
   *
   */
  request?: SubscriptionArgs<RT, E>['request'];

  /**
   * A query to use for the request. This should be an object that can be
   * passed to `store.request`. Use this in place of `@request` if you would
   * like the component to also initiate the request.
   *
   */
  query?: SubscriptionArgs<RT, E>['query'];

  /**
   * The autorefresh behavior for the request. This can be a boolean, or any
   * combination of the following values: `'online'`, `'interval'`, `'invalid'`.
   *
   * - `'online'`: Refresh the request when the browser comes back online
   * - `'interval'`: Refresh the request at a specified interval
   * - `'invalid'`: Refresh the request when the store emits an invalidation
   *
   * If `true`, this is equivalent to `'online,invalid'`.
   *
   * Defaults to `false`.
   *
   */
  autorefresh?: SubscriptionArgs<RT, E>['autorefresh'];

  /**
   * The number of milliseconds to wait before refreshing the request when the
   * browser comes back online or the network becomes available.
   *
   * This also controls the interval at which the request will be refreshed if
   * the `interval` autorefresh type is enabled.
   *
   * Defaults to `30_000` (30 seconds).
   *
   */
  autorefreshThreshold?: SubscriptionArgs<RT, E>['autorefreshThreshold'];

  /**
   * The behavior of the request initiated by autorefresh. This can be one of
   * the following values:
   *
   * - `'refresh'`: Refresh the request in the background
   * - `'reload'`: Force a reload of the request
   * - `'policy'` (**default**): Let the store's configured CachePolicy decide whether to
   *   reload, refresh, or do nothing.
   *
   * Defaults to `'policy'`.
   *
   */
  autorefreshBehavior?: SubscriptionArgs<RT, E>['autorefreshBehavior'];

  /**
   * The store instance to use for making requests. If contexts are available,
   * the component will default to using the `store` on the context.
   *
   * This is required if the store is not available via context or should be
   * different from the store provided via context.
   *
   */
  store?: Store | RequestManager;
}

interface PaginateSignature<RT, E> {
  Args: EmberPaginateArgs<RT, E>;
  Blocks: {
    idle: [];
    loading: [state: RequestLoadingState];
    cancelled: [error: StructuredErrorDocument<E>, features: RecoveryFeatures];
    error: [error: StructuredErrorDocument<E>, features: RecoveryFeatures];
    content: [
      state: PaginationState<RT, E>,
      features: PaginationContentFeatures<RT>,
    ];
    default: [
      state: PaginationState<RT, E>,
      features: PaginationContentFeatures<RT>,
    ];
    always: [state: PaginationState<RT, E>];
  };
}

export class Paginate<RT, E> extends Component<PaginateSignature<RT, E>> {
  @consume('store') declare _store: Store;

  get store(): Store | RequestManager {
    const store = this.args.store || this._store;
    assert(
      moduleExists('ember-provide-consume-context')
        ? `No store was provided to the <Paginate> component. Either provide a store via the @store arg or via the context API provided by ember-provide-consume-context.`
        : `No store was provided to the <Paginate> component. Either provide a store via the @store arg or by registering a store service.`,
      store
    );
    return store;
  }

  _state: PaginationSubscriptionState<RT, E> | null = null;
  get state(): PaginationSubscriptionState<RT, E> {
    let { _state } = this;
    const { store } = this;
    if (_state && _state.store !== store) {
      _state[DISPOSE]();
      _state = null;
    }

    if (!_state) {
      this._state = _state = createPaginationSubscription<RT, E>(store, this.args);
    }

    return _state;
  }

  willDestroy(): void {
    if (this._state) {
      this._state[DISPOSE]();
      this._state = null;
    }
  }

  <template>
    {{#if (has-block "default")}}
      {{yield this.state.paginationState this.state.contentFeatures}}

    {{else if (and this.state.isIdle (has-block "idle"))}}
      {{yield to="idle"}}

    {{else if this.state.isIdle}}
      <Throw @error={{IdleBlockMissingError}} />

    {{else if this.state.paginationState.isLoading}}
      {{yield (notNull this.state.paginationState.loadingState) to="loading"}}

    {{else if (and this.state.paginationState.isCancelled (has-block "cancelled"))}}
      {{yield (notNull this.state.paginationState.reason) this.state.errorFeatures to="cancelled"}}

    {{else if (and this.state.paginationState.isError (has-block "error"))}}
      {{yield (notNull this.state.paginationState.reason) this.state.errorFeatures to="error"}}

    {{else if this.state.paginationState.isSuccess}}
      {{yield this.state.paginationState this.state.contentFeatures to="content"}}

    {{else if (not this.state.paginationState.isCancelled)}}
      <Throw @error={{(notNull this.state.paginationState.reason)}} />
    {{/if}}

    {{yield this.state.paginationState to="always"}}
  </template>
}
