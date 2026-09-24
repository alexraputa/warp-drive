---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/experiments/storage/functions/configureSessionStorage.md
---

&#x20;

# &#x20;configureSessionStorage()

```ts
function configureSessionStorage(options: ReactiveStorageOptions): void;
```

Defined in: [warp-drive-packages/experiments/src/storage/storage.ts:78](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/experiments/src/storage/storage.ts#L78)

Configure options for the sessionStorage singleton.
Must be called before getSessionStorage() is first invoked.

## Parameters

### options

[`ReactiveStorageOptions`](../types/ReactiveStorageOptions.md)

## Returns

`void`
