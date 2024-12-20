import Script from "next/script";
import { ErrorBoundary } from "react-error-boundary";
import { createGlobalFetchMonitor } from "#/client/clientScripts.js";

// This should be placed in the root layout, usually app/layout.tsx
// It is actually rendered on the server, but the script itself is executed in the browser
export const PrefetchDiagnostics = () => {
  const fetchMonitor = createGlobalFetchMonitor();

  // Wrapped in ErrorBoundary to avoid https://react.dev/errors/460
  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Script
        id="fetch-monitor"
        strategy="beforeInteractive"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: need to do this in order to use the beforeInteractive strategy, which ensures we patch global fetch before any prefetch requests are made by next
        dangerouslySetInnerHTML={{
          __html: `(${fetchMonitor.toString()})();`,
        }}
      />
    </ErrorBoundary>
  );
};
