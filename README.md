# RSC Diagnostics

> [!CAUTION]
> This package should *not* be used in your production environment. It is a debugging tool with significant overhead and it is likely to cause performance problems.

This package helps identify excessively large RSC payloads in Next.js. The goal is to avoid situations where users inadvertently DoW (denial of wallet) themselves due to unnecessary bandwidth usage or degrade performance due to shifting render cycles from the server to the client.

## What problem does this solve?

When a large RSC payload is sent from the server to the client, it uses bandwidth just like any other object. This isn't especially difficult to detect, but you have to know what to look for. Even when you do, dynamically generated RSC payloads are impossible to predict unless you know exactly what data will be returned on the server. Most of the time this comes from an upstream provider (e.g. a CMS) and can be difficult to catch without knowing the possible contents of the response.

### What does it not solve?

This package does *not* resolve issues for you, and does not mitigate the problems it identifies. It is for diagnostics and troubleshooting in a local development environment.

## Usage

Until I settle on a better way to use this package, it is for *local development only*. This is not enforced in the code, but if you instrument your code and deploy it to production, you are responsible for whatever happens to your performance metrics and resource consumption

## Components

### `<PrefetchDiagnostics/>`

Render this component in your root layout to log prefetch requests, which contain an RSC payload.

#### Example

```jsx
import { PrefetchDiagnostics } from 'rsc-diagnostics';

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<PrefetchDiagnostics />
				{children}
			</body>
		</html>
	);
}
```

### `withClientPropsDiagnostics`

When rendering a client component from the server (i.e. at the client entrypoint), use this HOC to wrap and export your "real" client component.

Until a codemod is available, you will need to manually edit your client component files. The easiest way to do this without breaking components that use them is to append an underscore to the component's name, then export the wrapped component using its unmodified name.

For better error messages, be sure to set your original component's `displayName`.

#### Example

```jsx
'use client';
import { withClientPropsDiagnostics } from 'rsc-diagnostics';

const MyClientComponent_ = ({ user }) => {
  return <User data={user}/>
};

MyClientComponent_.displayName = 'MyClientComponent';

export const MyClientComponent = withClientPropsDiagnostics(MyClientComponent_);
```

## Resources

- [Decoding React Server Component Payloads](https://edspencer.net/2024/7/1/decoding-react-server-component-payloads)
- [The Forensics of React Server Components](https://www.smashingmagazine.com/2024/05/forensics-react-server-components/)
- [RSC Payload & Serialized Props](https://hrtyy.dev/web/rsc_payload/)
- [Devtools for React Server Components](https://www.alvar.dev/blog/creating-devtools-for-react-server-components)

## To Do

- Make sure estimates are reasonably close to real transfer size
- Collect data and format into more actionable report
  - Start a local server and write to DB? Would be cool to be able to track RSC payload metrics over time
- Automatic component instrumentation
- RSC parsing and cool data viz - explain *why* the payload is large
- Write tests 👼
