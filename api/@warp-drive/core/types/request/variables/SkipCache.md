---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/request/variables/SkipCache.md
description: >-
  Symbol key for a request's `cacheOptions` that, when true, makes the request
  bypass the CacheHandler so it neither resolves from nor updates the cache.
---

# &#x20;SkipCache

```ts
const SkipCache: "___(unique) Symbol(SkipCache)";
```

Defined in: [warp-drive-packages/core/src/types/request.ts:36](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/core/src/types/request.ts#L36)

A [cacheOptions](../types/RequestInfo.md#cacheoptions) flag which, when set,
signals that a request should never be handled by the cache-manager and
thus will never resolve from cache nor update the cache.
