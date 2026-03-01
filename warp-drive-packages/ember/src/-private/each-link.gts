import { service } from '@ember/service';
import Component from '@glimmer/component';

import { importSync, macroCondition, moduleExists } from '@embroider/macros';

import type { RequestManager, Store } from '@warp-drive/core';
import { assert } from '@warp-drive/core/build-config/macros';
import type {
  PaginationLink,
  PaginationState,
  PlaceholderPaginationLink,
  RealPaginationLink,
} from '@warp-drive/core/reactive';
import { createPaginationLinksSubscription } from '@warp-drive/core/reactive';
import { DISPOSE } from '@warp-drive/core/signals/-leaked';

let consume = service;
if (macroCondition(moduleExists('ember-provide-consume-context'))) {
  const { consume: contextConsume } = importSync('ember-provide-consume-context') as { consume: typeof service };
  consume = contextConsume;
}

type ContentFeatures = {
  loadNext: () => Promise<void>;
  loadPrev: () => Promise<void>;
  loadPage: (url: string) => Promise<void>;
};

interface EachLinkSignature<RT, E> {
  Args: {
    /**
     * The pagination state whose links should be iterated and rendered.
     *
     */
    pages: PaginationState<RT, E>;

    /**
     * The store instance to use for making requests. If contexts are available,
     * the component will default to using the `store` on the context.
     *
     * This is required if the store is not available via context or should be
     * different from the store provided via context.
     *
     */
    store?: Store | RequestManager;
  };
  Blocks: {
    link: [link: RealPaginationLink, features: ContentFeatures];
    placeholder: [link: PlaceholderPaginationLink, features: ContentFeatures];
    default: [link: PaginationLink, features: ContentFeatures];
  };
}

export class EachLink<RT, E> extends Component<EachLinkSignature<RT, E>> {
  @consume('store') declare _store: Store;

  get store(): Store | RequestManager {
    const store = this.args.store || this._store;
    assert(
      moduleExists('ember-provide-consume-context')
        ? `No store was provided to the <EachLink> component. Either provide a store via the @store arg or via the context API provided by ember-provide-consume-context.`
        : `No store was provided to the <EachLink> component. Either provide a store via the @store arg or by registering a store service.`,
      store
    );
    return store;
  }

  _state: ReturnType<typeof createPaginationLinksSubscription<RT, E>> | null = null;
  get state(): ReturnType<typeof createPaginationLinksSubscription<RT, E>> {
    let { _state } = this;
    const { store } = this;
    if (_state && _state.store !== store) {
      _state[DISPOSE]();
      _state = null;
    }

    if (!_state) {
      this._state = _state = createPaginationLinksSubscription<RT, E>(store, this.args);
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
    {{#each this.state.links as |link|}}
      {{#if link.isReal}}
        {{#if (has-block "link")}}
          {{yield link this.state.contentFeatures to="link"}}
        {{else}}
          {{yield link this.state.contentFeatures}}
        {{/if}}
      {{else if (has-block "placeholder")}}
        {{yield link this.state.contentFeatures to="placeholder"}}
      {{else}}
        {{yield link this.state.contentFeatures}}
      {{/if}}
    {{/each}}
  </template>
}
