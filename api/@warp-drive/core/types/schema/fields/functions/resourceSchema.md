---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/schema/fields/functions/resourceSchema.md
---

# &#x20;resourceSchema()

```ts
function resourceSchema<T extends 
  | PolarisResourceSchema
  | LegacyResourceSchema>(schema: 
  | PolarisResourceSchema
  | LegacyResourceSchema): T;
```

Defined in: [warp-drive-packages/core/src/types/schema/fields.ts:2516](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/schema/fields.ts#L2516)

A no-op type utility that enables type-checking resource schema
definitions.

Will return the passed in schema.

This will not validate relationship inverses or related types,
as doing so would require a full schema graph to be passed in
and no cycles in the graph to be present.

## Type Parameters

### T

`T` *extends*
| [`PolarisResourceSchema`](../types/PolarisResourceSchema.md)
| [`LegacyResourceSchema`](../types/LegacyResourceSchema.md)

## Parameters

### schema

| [`PolarisResourceSchema`](../types/PolarisResourceSchema.md)
| [`LegacyResourceSchema`](../types/LegacyResourceSchema.md)

## Returns

`T`
