export function estimateBytes(value: unknown): number {
  const _type = typeof value;

  // Don't care about anything but stringsobjects/arrays from here, those will be the most space intensive
  if (_type !== 'object' && _type !== 'string') return 0;

  try {
    // Simplified because we don't need to account for non-serializable objects anyway
    return new Blob([JSON.stringify(value)]).size;
  }
  catch (err) {
    if (err && err instanceof Error) {
      throw err
    }
  }
  return 0; // For functions and other types
}
