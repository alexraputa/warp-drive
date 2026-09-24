---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/legacy/compat/extensions/types/ArrayType.md
---

&#x20;

# &#x20;ArrayType\<T>

```ts
type ArrayType<T> = T extends ReadonlyArray<infer U> ? U : never;
```

Defined in: [warp-drive-packages/legacy/src/compat/extensions.ts:376](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/compat/extensions.ts#L376)

Extracts the element type of an array type, or `never` if `T` is not an array.

## Type Parameters

### T

`T`
