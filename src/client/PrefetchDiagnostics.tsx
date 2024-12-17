"use client";

import { fetchMonitor } from "@/client/lib/fetchMonitor";
import Script from "next/script";

// This must be placed in the root layout, usually app/layout.tsx
// It is actually rendered on the server, but the script itself is executed in the browser
export const PrefetchDiagnostics = () => {
  return (
    <Script
      id="fetch-monitor"
      strategy="beforeInteractive"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: kind of hacky, but need to do this in order to use the beforeInteractive strategy, which ensures we patch global fetch before  prefetch requests are made
      dangerouslySetInnerHTML={{
        __html: `(${fetchMonitor.toString()})();`,
      }}
    />
  );
};
