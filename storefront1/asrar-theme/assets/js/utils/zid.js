/**
 * Waits for window.zid SDK to be ready
 */
export async function waitForZid(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    if (window.zid) return true;
    await new Promise((r) => setTimeout(r, 100 * Math.min(i + 1, 8)));
  }
  console.warn('[Asrar Theme] Zid SDK not found after waiting.');
  return false;
}
