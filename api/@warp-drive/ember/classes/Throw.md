---
url: https://canary.warp-drive.io/api/@warp-drive/ember/classes/Throw.md
description: >-
  Component that throws its `@error` argument when rendered, for templates that
  should fail if they reach that point.
---

# &#x20;Throw\<T>

Defined in: [warp-drive-packages/ember/dist/index.d.ts:427](https://github.com/warp-drive-data/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/ember/dist/index.d.ts#L427)

The `<Throw />` component is used to throw an error in a template.

That's all it does. So don't use it unless the application should
throw an error if it reaches this point in the template.

```gts
<Throw @error={{anError}} />
```

## Extends

* `default`<`ThrowSignature`<`T`>>

## Type Parameters

### T

`T`

## Constructors

### Constructor

```ts
new Throw<T>(owner: Owner, args: {
  error: T;
}): Throw<T>;
```

Defined in: [warp-drive-packages/ember/dist/index.d.ts:428](https://github.com/warp-drive-data/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/ember/dist/index.d.ts#L428)

#### Parameters

##### owner

`Owner`

##### args

###### error

`T`

#### Returns

`Throw`<`T`>

#### Overrides

```ts
Component<ThrowSignature<T>>.constructor
```
