---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/legacy/types/LegacyStoreSetupOptions.md
---

&#x20;

# &#x20;LegacyStoreSetupOptions\<T *extends* `Cache` = `Cache`>

```ts
type LegacyStoreSetupOptions<T extends Cache = Cache> = 
  | LegacyModelStoreSetupOptions<T>
  | LegacyModelAndNetworkStoreSetupOptions<T>
| LegacyModelAndNetworkAndRequestStoreSetupOptions<T>;
```

Defined in: [warp-drive-packages/legacy/src/index.ts:154](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/index.ts#L154)

The available options when setting up the legacy store,
one of:

* [LegacyModelStoreSetupOptions](LegacyModelStoreSetupOptions.md)
* [LegacyModelAndNetworkStoreSetupOptions](LegacyModelAndNetworkStoreSetupOptions.md)
* [LegacyModelAndNetworkAndRequestStoreSetupOptions](LegacyModelAndNetworkAndRequestStoreSetupOptions.md)

## Type Parameters

### T

`T` *extends* `Cache` = `Cache`
