# RSC Diagnostics

> [!CAUTION]
> This package should *not* be used in your production environment. It is a debugging tool with significant overhead and it is likely to cause performance problems.

This package helps identify excessively large RSC payloads in Next.js. The goal is to avoid situations where users inadvertently DoW (denial of wallet) themselves due to unnecessary bandwidth usage.

## What problem does this solve?

When a large RSC payload is sent from the server to the client, it incurs bandwidth usage. This is tricky to detect, especially when you don't have access to the source code. Even when you do, dynamically generated RSC payloads are impossible to predict unless you know exactly what data will be used. Most of the time this comes from an upstream provider (e.g. a CMS) and can be difficult to catch without knowing the possible contents of the response.

### What does this not solve?

It does not diagnose RSC payloads that are dynamically created at runtime.

## Structure

The package is divided into two submodules, one to be used on the client and one to be used on the server. The boundary is sort of blurred, but the separation exists to prevent bundling errors on the client as the library evolves.

### Client

`<PrefetchDiagnostics/>`

Render this component to log prefetch requests, which contain an RSC payload.

### Server

#### `withClientPropsDiagnostics`

When rendering a client component from the server (i.e. at the client entrypoint), use this HOC to wrap and export your "real" client component.

```jsx
'use client';

const MyClientComponent_ = ({ user }) => {
  return <User data={user}/>
};

export const MyClientComponent = withClientPropsDiagnostics(MyClientComponent_);
```

## Implementation

## Further reading

- [Decoding React Server Component Payloads](https://edspencer.net/2024/7/1/decoding-react-server-component-payloads)
- [The Forensics of React Server Components](https://www.smashingmagazine.com/2024/05/forensics-react-server-components/)
- [RSC Payload & Serialized Props](https://hrtyy.dev/web/rsc_payload/)
- [Devtools for React Server Components](https://www.alvar.dev/blog/creating-devtools-for-react-server-components)

## To do

- Align size calculations more closely with actual usage data
- Collect data and format into more actionable report
- Automatic component instrumentation
- RSC parsing and cool data viz; drill down into *why* the payload is large
  - Map to corresponding chunk via @next/bundle-analyzer???
