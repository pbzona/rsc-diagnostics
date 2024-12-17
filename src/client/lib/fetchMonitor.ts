import { logInterceptedResponse } from "./logInterceptedRequest";

export function fetchMonitor() {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async function (...args) {
    const [resource, config] = args

    // Check if the request should be logged
    let url: URL;

    if (typeof resource === 'string') {
      url = new URL(resource, globalThis.location.origin)
    } else if (resource instanceof URL) {
      url = new URL(resource, globalThis.location.origin);
    } else if (resource instanceof Request) {
      url = new URL(resource.url, globalThis.location.origin);
    } else {
      throw new Error('Invalid resource provided to fetch')
    }

    // Todo - extract 'shouldLog' into something more configurable
    const shouldLog = url.searchParams.has('_rsc') ||
      (config?.headers && (config.headers as any)['Next-Router-Prefetch'] === '1');

    try {
      // Next prefetch href has to be a string - not URL object - so use url.pathname
      const response = await originalFetch.apply(this, [url.pathname, config])

      if (shouldLog) {
        logInterceptedResponse(response)
      }

      return response
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }
}
