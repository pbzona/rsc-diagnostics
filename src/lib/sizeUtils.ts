export const estimateBytes = (value: unknown): number => {
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

// Utility for generating/parsing human readable object sizes
// Examples:
// size().in.kB(2) -> 2048
// size().toFormatted(2048) -> '2 kB'
export const size = () => ({
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
