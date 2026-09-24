---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/cache/operations/types/UpdateResourceOperation.md
---

# &#x20;UpdateResourceOperation

```ts
interface UpdateResourceOperation extends Op {
  op: "update";
  record: PersistedResourceKey;
  value: ExistingResourceObject;
}
```

Defined in: [warp-drive-packages/core/src/types/cache/operations.ts:101](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/cache/operations.ts#L101)

Upserts (merges) new state for a resource

## Extends

* [`Op`](Op.md)

## Properties

### op

```ts
op: "update";
```

Defined in: [warp-drive-packages/core/src/types/cache/operations.ts:102](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/cache/operations.ts#L102)

The name of the [operation](Op.md)

#### Overrides

[`Op`](Op.md).[`op`](Op.md#op)

***

### record

```ts
record: PersistedResourceKey;
```

Defined in: [warp-drive-packages/core/src/types/cache/operations.ts:106](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/cache/operations.ts#L106)

The cache key for the resource

***

### value

```ts
value: ExistingResourceObject;
```

Defined in: [warp-drive-packages/core/src/types/cache/operations.ts:110](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/cache/operations.ts#L110)

The new state to merge into the resource
