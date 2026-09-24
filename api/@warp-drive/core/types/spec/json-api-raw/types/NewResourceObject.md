---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/spec/json-api-raw/types/NewResourceObject.md
---

# &#x20;NewResourceObject\<T *extends* `string` = `string`>

```ts
type NewResourceObject<T extends string = string> = NewResourceIdentifierObject<T> & {
  attributes?: ObjectValue;
  links?: Links;
  meta?: Meta;
  relationships?: ResourceRelationshipsObject;
};
```

Defined in: [warp-drive-packages/core/src/types/spec/json-api-raw.ts:305](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/spec/json-api-raw.ts#L305)

Represents a new resource that has not yet been persisted, as it would
appear in a {json:api} document (for instance, the body of a `POST` request).

## Type Declaration

### attributes?

```ts
optional attributes?: ObjectValue;
```

the resource's attributes

### links?

```ts
optional links?: Links;
```

links related to the resource

### meta?

```ts
optional meta?: Meta;
```

meta information about the resource

### relationships?

```ts
optional relationships?: ResourceRelationshipsObject;
```

the resource's relationships to other resources

## Type Parameters

### T

`T` *extends* `string` = `string`

## Example

```json
{
  "data": {
    "type": "user",
    "lid": "@lid:user-1",
    "attributes": { "name": "Chris" }
  }
}
```
