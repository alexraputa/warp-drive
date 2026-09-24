---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/legacy/model/functions/teardownRecord.md
---

&#x20;

# &#x20;teardownRecord()

```ts
function teardownRecord(record: Model): void;
```

Defined in: [warp-drive-packages/legacy/src/model/-private/hooks.ts:56](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/model/-private/hooks.ts#L56)

The `teardownRecord` hook implementation for use with `Model`. Pass this
to your store's `teardownRecord` method when configuring the store to
use `Model` for schema/record instantiation.

## Parameters

### record

[`Model`](../classes/Model.md)

## Returns

`void`
