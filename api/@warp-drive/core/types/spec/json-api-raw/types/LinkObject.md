---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/spec/json-api-raw/types/LinkObject.md
---

# &#x20;LinkObject

```ts
type LinkObject = {
  href: string;
  meta?: Meta;
};
```

Defined in: [warp-drive-packages/core/src/types/spec/json-api-raw.ts:18](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/spec/json-api-raw.ts#L18)

The object form of a [Link](Link.md), allowing a link to carry
additional [meta](Meta.md) information alongside its `href`.

[{json:api} Spec](https://jsonapi.org/format/#document-links)

## Properties

### href

```ts
href: string;
```

Defined in: [warp-drive-packages/core/src/types/spec/json-api-raw.ts:22](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/spec/json-api-raw.ts#L22)

the URI-reference for the link

***

### meta?

```ts
optional meta?: Meta;
```

Defined in: [warp-drive-packages/core/src/types/spec/json-api-raw.ts:26](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/spec/json-api-raw.ts#L26)

meta information about the link
