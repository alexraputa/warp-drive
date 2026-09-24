---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/configure/types/HooksOptions.md
---

# &#x20;HooksOptions

```ts
interface HooksOptions {
  wellknown: { Array: string | symbol };
}
```

Defined in: [warp-drive-packages/core/src/signals/reactivity/configure.ts:133](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/signals/reactivity/configure.ts#L133)

Contains information a [SignalHooks](SignalHooks.md) implementation may want
to use, such as the specialized key used for the signal
representing an array's contents / length.

```ts
interface HooksOptions {
  wellknown: {
    Array: symbol | string;
  }
}
```

## Properties

### wellknown

```ts
wellknown: {
  Array: string | symbol;
};
```

Defined in: [warp-drive-packages/core/src/signals/reactivity/configure.ts:139](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/signals/reactivity/configure.ts#L139)

A list of specialized symbols/strings
used by WarpDrive to encapsulate key
reactivity concerns.

#### Array

```ts
Array: string | symbol;
```

The key used when the signal provides reactivity for the
`length` or "contents" of an array.

Arrays only use a single signal for all accesses, regardless
of index, property or method: this one.
