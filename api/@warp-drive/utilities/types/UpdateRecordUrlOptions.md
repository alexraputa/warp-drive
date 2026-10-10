---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/utilities/types/UpdateRecordUrlOptions.md
description: >-
  Options passed to `buildBaseURL` to build the URL for saving changes to an
  existing record by type and id.
---

# &#x20;UpdateRecordUrlOptions

```ts
interface UpdateRecordUrlOptions {
  host?: string;
  identifier: { id: string; type: string };
  namespace?: string;
  op: "updateRecord";
  resourcePath?: string;
}
```

Defined in: [index.ts:338](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/utilities/src/index.ts#L338)

[buildBaseURL](../functions/buildBaseURL.md) options for an `updateRecord` request.

## Properties

### host?

```ts
optional host?: string;
```

Defined in: [index.ts:363](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/utilities/src/index.ts#L363)

Overrides the globally configured host for this call only.

***

### identifier

```ts
identifier: {
  id: string;
  type: string;
};
```

Defined in: [index.ts:346](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/utilities/src/index.ts#L346)

The type and id of the record being updated.

#### id

```ts
id: string;
```

The resource id.

#### type

```ts
type: string;
```

The resource type.

***

### namespace?

```ts
optional namespace?: string;
```

Defined in: [index.ts:367](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/utilities/src/index.ts#L367)

Overrides the globally configured namespace for this call only.

***

### op

```ts
op: "updateRecord";
```

Defined in: [index.ts:342](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/utilities/src/index.ts#L342)

The request operation this URL is for.

***

### resourcePath?

```ts
optional resourcePath?: string;
```

Defined in: [index.ts:359](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/utilities/src/index.ts#L359)

The path segment for the resource, defaults to `identifier.type` if not provided.
