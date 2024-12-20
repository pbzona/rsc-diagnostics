import { config } from "../config";

type InterceptedResponseLogger = (response: Response) => void;
type LoggingFunction = (response: Response, responseBody: string) => void;

const createInterceptedRequestLogger = (
  loggingFn: LoggingFunction
): InterceptedResponseLogger => {
  return (response: Response) => {
    const clone = response.clone();
    clone.text().then(body => {
      loggingFn(clone, body);
    })
  };
};

const logLargeRscResponse = (response: Response, body: string) => {
  const estimateBytes = (value: unknown): number => {
    // Only care about strings/objects/arrays as they are:
    // 1. Most likely to take up large amounts of space
    // 2. Serializable (functions are not)
    // 3. Easily inspectable (promises are not - the settled value is more meaningful anyway)
    const _type = typeof value;
    if (_type !== "object" && _type !== "string") return 0;

    // Simplified because we don't need to account for non-serializable objects anyway
    return new Blob([JSON.stringify(value)]).size;
  }

  const DECIMAL_PLACES = 2;
  const size = () => ({
    in: {
      // Translates kB -> B
      kB(kilobytes: number): number {
        return kilobytes / 1024;
      },
      // Tranlates MB -> B
      MB(megabytes: number): number {
        return megabytes / 1024 / 1024;
      },
    },
    // Do this recursively in the future
    toFormatted(bytes: number): string {
      const inMegabytes = bytes / 1024 ** 2;
      if (inMegabytes > 1) {
        return `${inMegabytes.toFixed(DECIMAL_PLACES)} MB`;
      }

      const inKilobytes = bytes / 1024 ** 2;
      if (inKilobytes > 1) {
        return `${inKilobytes.toFixed(DECIMAL_PLACES)} kB`;
      }

      return `${bytes.toFixed(DECIMAL_PLACES)} B`;
    },
  });

  const rscPayloadSize = estimateBytes(body.length);

  if (rscPayloadSize >= 0) {
    console.log("Size of RSC payload:", (rscPayloadSize));
    console.log(`Prefetch response for ${response.url}`, {
      url: response.url,
      headers: Object.fromEntries(response.headers.entries()),
      body,
    });
  }
}

const largeRscPayloadLogger = createInterceptedRequestLogger(logLargeRscResponse);

// Create a function that overrides the global fetch
export const createGlobalFetchMonitor = () => {
  return () => {
    // Putting this inside the iife bc typescript is dumb
    const getUrlObject = (resource: RequestInfo | URL | string): URL => {
      if (typeof resource === "string") {
        return new URL(resource, globalThis.location.origin);
      }

      if (resource instanceof URL) {
        return new URL(resource, globalThis.location.origin);
      }

      if (resource instanceof Request) {
        return new URL(resource.url, globalThis.location.origin);
      }

      throw new Error("Invalid resource provided to fetch");
    };

    const originalFetch = globalThis.fetch;

    globalThis.fetch = async function (...args) {
      const [resource, config] = args;

      const url = getUrlObject(resource);
      const response = await originalFetch.apply(this, [url.pathname, config]);

      const isRscPrefetch =
        url.searchParams.has("_rsc") ||
        (config?.headers &&
          (config?.headers as unknown & { "Next-Router-Prefetch"?: string })["Next-Router-Prefetch"] === "1");

      if (isRscPrefetch) {
        largeRscPayloadLogger(response);
      }

      // Pass through
      return response;
    };
  };
};
