/**
 * Wishlist — toggle add/remove from wishlist
 */
export function initWishlist() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-wishlist-toggle]');
    if (!btn) return;

    e.preventDefault();
    const productId = btn.dataset.wishlistToggle;
    const emptyIcon = btn.querySelector('[data-wishlist-icon-empty]');
    const filledIcon = btn.querySelector('[data-wishlist-icon-filled]');

    try {
      const isWishlisted = btn.dataset.wishlisted === 'true';
      if (isWishlisted) {
        await window.zid?.wishlist?.removeProduct?.({ product_id: productId });
        btn.dataset.wishlisted = 'false';
        emptyIcon?.removeAttribute('hidden');
        filledIcon?.setAttribute('hidden', '');
      } else {
        await window.zid?.wishlist?.addProduct?.({ product_id: productId });
        btn.dataset.wishlisted = 'true';
        emptyIcon?.setAttribute('hidden', '');
        filledIcon?.removeAttribute('hidden');
      }
    } catch (_) {
      // If not logged in, redirect
      window.handleLoginAction?.();
    }
  });
}
