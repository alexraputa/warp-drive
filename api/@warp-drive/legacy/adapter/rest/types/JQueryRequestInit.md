---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/legacy/adapter/rest/types/JQueryRequestInit.md
---

&#x20;

# &#x20;JQueryRequestInit

```ts
interface JQueryRequestInit extends JQueryAjaxSettings {
  method: HTTPMethod;
  type: HTTPMethod;
  url: string;
}
```

Defined in: [warp-drive-packages/legacy/src/adapter/rest.ts:82](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/adapter/rest.ts#L82)

The options passed to jQuery's `$.ajax` by RESTAdapter.\_ajaxRequest | \_ajaxRequest.

## Extends

* `JQueryAjaxSettings`

## Properties

### method

```ts
method: HTTPMethod;
```

Defined in: [warp-drive-packages/legacy/src/adapter/rest.ts:90](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/adapter/rest.ts#L90)

the HTTP method to use

#### Overrides

```ts
JQueryAjaxSettings.method
```

***

### type

```ts
type: HTTPMethod;
```

Defined in: [warp-drive-packages/legacy/src/adapter/rest.ts:94](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/adapter/rest.ts#L94)

the HTTP method to use, duplicated for jQuery/fetch option compatibility

#### Overrides

```ts
JQueryAjaxSettings.type
```

***

### url

```ts
url: string;
```

Defined in: [warp-drive-packages/legacy/src/adapter/rest.ts:86](https://github.com/alexraputa/warp-drive/blob/42b515069d07a4a417d09cfee36cdce56c92f754/warp-drive-packages/legacy/src/adapter/rest.ts#L86)

the url to request

#### Overrides

```ts
JQueryAjaxSettings.url
```
