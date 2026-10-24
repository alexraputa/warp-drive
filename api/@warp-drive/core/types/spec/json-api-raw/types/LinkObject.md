---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/spec/json-api-raw/types/LinkObject.md
description: >-
  The object form of a {json:api} link: an `href` URI-reference plus optional
  `meta`.
---

# &#x20;LinkObject

```ts
type LinkObject = {
  href: string;
  meta?: Meta;
};
```

Defined in: [warp-drive-packages/core/src/types/spec/json-api-raw.ts:29](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/core/src/types/spec/json-api-raw.ts#L29)

The object form of a [Link](Link.md), allowing a link to carry
additional [meta](Meta.md) information alongside its `href`.

[{json:api} Spec](https://jsonapi.org/format/#document-links)

## Properties

### href

```ts
href: string;
```

Defined in: [warp-drive-packages/core/src/types/spec/json-api-raw.ts:33](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/core/src/types/spec/json-api-raw.ts#L33)

the URI-reference for the link

***

### meta?

```ts
optional meta?: Meta;
```

Defined in: [warp-drive-packages/core/src/types/spec/json-api-raw.ts:37](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/core/src/types/spec/json-api-raw.ts#L37)

meta information about the link
