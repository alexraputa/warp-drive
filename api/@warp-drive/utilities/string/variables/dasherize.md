---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/utilities/string/variables/dasherize.md
---

# &#x20;dasherize&#x20;

```ts
const dasherize: (str: string) => string = internalDasherize;
```

Defined in: [-private/string/transform.ts:40](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/utilities/src/-private/string/transform.ts#L40)

Replaces underscores, spaces, or camelCase with dashes.

```js
import { dasherize } from '@warp-drive/utilities/string';

dasherize('innerHTML');                // 'inner-html'
dasherize('action_name');              // 'action-name'
dasherize('css-class-name');           // 'css-class-name'
dasherize('my favorite items');        // 'my-favorite-items'
dasherize('privateDocs/ownerInvoice';  // 'private-docs/owner-invoice'
```

## Parameters

### str

`string`

## Returns

`string`
