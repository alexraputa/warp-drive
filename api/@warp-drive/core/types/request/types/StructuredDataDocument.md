---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/core/types/request/types/StructuredDataDocument.md
---

# &#x20;StructuredDataDocument\<T>

```ts
interface StructuredDataDocument<T> {
  content: T;
  request: ImmutableRequestInfo;
  response: 
  | Response
  | ResponseInfo
  | null;
}
```

Defined in: [warp-drive-packages/core/src/types/request.ts:445](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/request.ts#L445)

When a [Future](../../../request/types/Future.md) resolves, it returns an object
containing the original [request](RequestInfo.md),
the [response](https://developer.mozilla.org/docs/Web/API/Response) set by the handler chain (if any), and
the processed content.

## Type Parameters

### T

`T`

## Properties

### content

```ts
content: T;
```

Defined in: [warp-drive-packages/core/src/types/request.ts:461](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/request.ts#L461)

the processed content of the response

***

### request

```ts
request: ImmutableRequestInfo;
```

Defined in: [warp-drive-packages/core/src/types/request.ts:453](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/request.ts#L453)

#### See

[ImmutableRequestInfo](ImmutableRequestInfo.md)

***

### response

```ts
response: 
  | Response
  | ResponseInfo
  | null;
```

Defined in: [warp-drive-packages/core/src/types/request.ts:457](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/core/src/types/request.ts#L457)

the response set by the handler chain, if any
