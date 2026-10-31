---
url: >-
  https://canary.warp-drive.io/api/@warp-drive/react/functions/ReactiveContext.md
description: >-
  Component that re-renders its children when WarpDrive signals they read
  change, by providing a signal watcher through `WatcherContext`.
---

# &#x20;ReactiveContext()

```ts
function ReactiveContext(__namedParameters: {
  children: ReactNode;
}): Element;
```

Defined in: [-private/reactive-context.tsx:193](https://github.com/alexraputa/warp-drive/blob/b66aef3184105620cb042e7c2b988b1e3164b5da/warp-drive-packages/react/src/-private/reactive-context.tsx#L193)

Re-renders its `children` when a WarpDrive signal they read changes.
`<Request />` already wraps its content in one; wrap any other component
that reads reactive WarpDrive data, such as a record's fields.

The JS API example in [Reactive Control Flow](/guides/the-manual/reactivity/control-flow)
shows it wrapping a component that reads request state with `getRequestState`.

It accepts a single prop, `children`.

## Parameters

### \_\_namedParameters

#### children

`ReactNode`

## Returns

`Element`

## Example

```tsx
import { ReactiveContext } from "@warp-drive/react";

export function UserName({ user }: { user: User }) {
  return (
    <ReactiveContext>
      <span>{user.name}</span>
    </ReactiveContext>
  );
}
```
