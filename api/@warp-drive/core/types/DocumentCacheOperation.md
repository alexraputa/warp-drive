---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/DocumentCacheOperation.md
description: >-
  The notification kinds sent to request document subscribers, such as `updated`
  or `invalidated`.
---

# &#x20;DocumentCacheOperation

```ts
type DocumentCacheOperation = "invalidated" | "added" | "removed" | "updated" | "state";
```

Defined in: [warp-drive-packages/core/src/store/-private/managers/notification-manager.ts:26](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/core/src/store/-private/managers/notification-manager.ts#L26)

The kinds of change notifications the [NotificationManager](../store/types/NotificationManager.md) can emit for a request document.
