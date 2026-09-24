---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/params/types/QueryParamsSource.md
---

# &#x20;QueryParamsSource

```ts
type QueryParamsSource = 
  | {
  include?: string | string[];
} & Record<Exclude<string, "include">, Serializable>
  | URLSearchParams;
```

Defined in: [warp-drive-packages/core/src/types/params.ts:38](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/params.ts#L38)

The query parameters to serialize for a request: either a
dictionary of [Serializable](Serializable.md) values (with an optional
`include` member for specifying relationships to sideload),
or a native `URLSearchParams` instance.
