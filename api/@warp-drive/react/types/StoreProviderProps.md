---
url: https://canary.warp-drive.io/api/@warp-drive/react/types/StoreProviderProps.md
description: >-
  The props of the React `<StoreProvider />` component: its children plus either
  a Store instance or a Store class to instantiate.
---

# &#x20;StoreProviderProps

```ts
type StoreProviderProps = 
  | {
  children: ReactNode;
  store: Store;
}
  | {
  children: ReactNode;
  Store: typeof Store;
};
```

Defined in: [-private/store-provider.tsx:41](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/react/src/-private/store-provider.tsx#L41)

The props accepted by [\`\<StoreProvider />\`](../functions/StoreProvider.md): `children`,
and either `store`, an existing Store instance to provide, or `Store`, a
Store class the provider instantiates once and provides.

## Union Members

### Type Literal

```ts
{
  children: ReactNode;
  store: Store;
}
```

#### children

```ts
children: ReactNode;
```

The components that can read the store with [useStore](../functions/useStore.md).

#### store

```ts
store: Store;
```

The Store instance to provide.

***

### Type Literal

```ts
{
  children: ReactNode;
  Store: typeof Store;
}
```

#### children

```ts
children: ReactNode;
```

The components that can read the store with [useStore](../functions/useStore.md).

#### Store

```ts
Store: typeof Store;
```

A Store class to instantiate once and provide.

## Example

```tsx
import type { StoreProviderProps } from "@warp-drive/react";

const props: StoreProviderProps = { store, children: <App /> };
```
