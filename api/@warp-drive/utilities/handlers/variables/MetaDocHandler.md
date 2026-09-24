---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/utilities/handlers/variables/MetaDocHandler.md
---

# &#x20;MetaDocHandler

```ts
const MetaDocHandler: Handler;
```

Defined in: [-private/handlers/meta-doc.ts:50](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/utilities/src/-private/handlers/meta-doc.ts#L50)

MetaDocHandler processes requests that are marked as meta requests.

It treats the response body as "entirely meta" transforming

```ts
{
  some: "key",
  another: "thing"
}
```

into

```ts
{
	 meta: {
    some: "key",
    another: "thing"
  }
}
```

To activate this handler, a request should specify

```ts
options.isMetaRequest = true
```

For instance

```ts
store.request({
  url: '/example',
  options: {
    isMetaRequest: true
  }
});
```

Errors are not processed by this handler, so if the request fails and the error response
is not in {json:api} format additional processing may be needed.
