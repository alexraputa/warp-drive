---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/legacy/model/migration-support/types/WithLegacyDerivations.md
---

&#x20;

# &#x20;WithLegacyDerivations\<T *extends* [`TypedRecordInstance`](../../../../core/types/record/types/TypedRecordInstance.md)>

```ts
type WithLegacyDerivations<T extends TypedRecordInstance> = T & MinimalLegacyRecord & {
  belongsTo: typeof belongsTo;
  hasMany: typeof hasMany;
};
```

Defined in: [warp-drive-packages/legacy/src/model/migration-support.ts:87](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/model/migration-support.ts#L87)

Adds the `Model`-style `belongsTo`/`hasMany` reference methods to a
[TypedRecordInstance](../../../../core/types/record/types/TypedRecordInstance.md), for use when migrating a resource from
`Model` to a schema-based record while preserving these APIs.

## Type Declaration

### belongsTo

```ts
belongsTo: typeof belongsTo;
```

see belongsTo

### hasMany

```ts
hasMany: typeof hasMany;
```

see hasMany

## Type Parameters

### T

`T` *extends* [`TypedRecordInstance`](../../../../core/types/record/types/TypedRecordInstance.md)
