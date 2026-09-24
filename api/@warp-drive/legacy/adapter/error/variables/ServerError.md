---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/legacy/adapter/error/variables/ServerError.md
---

&#x20;

# &#x20;ServerError

```ts
ServerError: AdapterRequestErrorConstructor<ServerError>;
```

Defined in: [warp-drive-packages/legacy/src/adapter/error.ts:503](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/adapter/error.ts#L503)

A `ServerError` equates to an HTTP `500 Internal Server Error` response
status. It is used by the adapter to indicate that a request has failed
because of an error in the external API, and is unlikely to succeed if
retried immediately.

An example use case would be to show a generic "something went wrong on
our end" message rather than one implying the user made a mistake:

```js [app/routes/application.js]
import { ServerError } from '@warp-drive/legacy/adapter/error';

export default class ApplicationRoute extends Route {
  @action
  error(error, transition) {
    if (error instanceof ServerError) {
      alert('Something went wrong on our end. Please try again later.');
      return;
    }

    // ...other error handling logic
  }
}
```
