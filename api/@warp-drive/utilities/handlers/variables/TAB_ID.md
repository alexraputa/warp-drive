---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/utilities/handlers/variables/TAB_ID.md
description: >-
  Random UUID identifying the current browser tab, kept in `sessionStorage`
  across reloads, for request tracing.
---

# &#x20;TAB\_ID

```ts
const TAB_ID: string;
```

Defined in: [-private/handlers/utils.ts:38](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/utilities/src/-private/handlers/utils.ts#L38)

A unique identifier for the current browser tab
useful for observability/tracing and deduping
across multiple tabs.
