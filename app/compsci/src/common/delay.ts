/**
 * Creates a cancellable, speed-scaled delay function shared by every
 * animated scene (sort and search alike): waits `ms / speedRef.current`,
 * but polls every 16ms and resolves early once `abortRef.current` flips to
 * true, so an in-flight animation can be interrupted by Stop/Generate.
 */
export function createDelay(
  speedRef: React.RefObject<number>,
  abortRef: React.RefObject<boolean>
) {
  return (ms: number) =>
    new Promise<void>(resolve => {
      if (abortRef.current) {
        resolve();
        return;
      }
      const scaled = Math.round(ms / speedRef.current);
      const id = setTimeout(resolve, scaled);
      const poll = setInterval(() => {
        if (abortRef.current) {
          clearTimeout(id);
          clearInterval(poll);
          resolve();
        }
      }, 16);
      setTimeout(() => clearInterval(poll), scaled + 1);
    });
}
