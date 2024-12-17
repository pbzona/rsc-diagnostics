import { estimateBytes } from "@/shared/estimateBytes";
import React from "react";

const THRESHOLD = 0; // Implement this later

// This should be used on the server to wrap client components
export function withClientPropsDiagnostics<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithClientPropsDiagnostics(props: P) {
    for (const [propName, propValue] of Object.entries(props)) {
      const sizeInBytes = estimateBytes(propValue);

      if (sizeInBytes >= THRESHOLD) {
        console.log(
          `⚠️ Large client component prop in ${WrappedComponent.displayName}`,
        );
        console.log(`${propName}: ${sizeInBytes.toLocaleString()} B`);
      }
    }

    // ReactNode can be things other than a component, can't just render this as JSX
    return React.createElement(WrappedComponent, props);
  };
}
