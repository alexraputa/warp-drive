---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/build-config/deprecations/variables/DEPRECATE_MANY_ARRAY_DUPLICATES.md
---

# &#x20;DEPRECATE\_MANY\_ARRAY\_DUPLICATES&#x20;

```ts
const DEPRECATE_MANY_ARRAY_DUPLICATES: boolean = true;
```

Defined in: [deprecations.ts:407](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/build-config/src/deprecations.ts#L407)

When the flag is `true` (default), adding duplicate records to a `ManyArray`
is deprecated in non-production environments. In production environments,
duplicate records added to a `ManyArray` will be deduped and no error will
be thrown.

When the flag is `false`, an error will be thrown when duplicates are added.

## Until

6.0
