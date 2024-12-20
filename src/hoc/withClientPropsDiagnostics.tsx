import { config } from "@/config";
import { estimateBytes, size } from "@/lib/sizeUtils";
import React from "react";

// This should be used on the server to wrap client components
export function withClientPropsDiagnostics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithClientPropsDiagnostics(props: P) {
    for (const [propName, propValue] of Object.entries(props)) {
      const sizeInBytes = estimateBytes(propValue);

      if (sizeInBytes >= config.thresholds.prefetchRscSize) {
        console.log(
          `⚠️ Large client component prop in ${WrappedComponent.displayName}`,
        );
        console.log(`${propName}: ${size().toFormatted(sizeInBytes)}`);
      }
    }

    // ReactNode can be things other than a component, can't just render this as JSX.
    return React.createElement(WrappedComponent, props);
  };
}
