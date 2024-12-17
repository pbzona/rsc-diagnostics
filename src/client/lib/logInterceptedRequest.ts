import { estimateBytes } from "@/shared/estimateBytes";

const THRESHOLD = 0;

export function logInterceptedResponse(response: Response) {
  // Clone the response so we can read its body
  const clone = response.clone()

  clone.text().then(body => {
    const rscPayloadSize = estimateBytes(body);
    console.log('Size of RSC payload:', rscPayloadSize.toLocaleString(), 'B');
    console.log(`Prefetch response for ${clone.url}`, {
      url: clone.url,
      headers: Object.fromEntries(clone.headers.entries()),
      body
    })
  })
}
