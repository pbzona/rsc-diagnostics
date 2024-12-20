import { size } from "./lib/sizeUtils";

interface RSCDiagnosticsConfig {
  thresholds: {
    clientPropSize: number;
    prefetchRscSize: number;
  };
}

// Todo - figure out reasonable defaults
export const config: RSCDiagnosticsConfig = {
  thresholds: {
    clientPropSize: process.env.MAX_CLIENT_PROP_SIZE ?
      size().in.kB(Number.parseFloat(process.env.MAX_CLIENT_PROP_SIZE)) :
      size().in.kB(1),
    prefetchRscSize: process.env.MAX_PREFETCH_PAYLOAD_SIZE ?
      size().in.kB(Number.parseFloat(process.env.MAX_PREFETCH_PAYLOAD_SIZE)) :
      size().in.kB(4),
  },
};
