---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/legacy/model-fragments/variables/FragmentExtension.md
---

&#x20;

# &#x20;FragmentExtension

```ts
const FragmentExtension: {
  features: typeof Fragment;
  kind: "object";
  name: "fragment";
};
```

Defined in: [warp-drive-packages/legacy/src/model-fragments/extensions/fragment.ts:73](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/model-fragments/extensions/fragment.ts#L73)

A schema extension that adds the [Fragment](../classes/Fragment.md) API to migrated
`ModelFragments` object resources.

## Type Declaration

### features

```ts
features: typeof Fragment;
```

The features ([Fragment](../classes/Fragment.md)) added by this extension.

### kind

```ts
kind: "object";
```

This extension applies to `'object'` schemas.

### name

```ts
name: "fragment";
```

The registered name of this extension.
