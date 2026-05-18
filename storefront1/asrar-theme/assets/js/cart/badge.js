/**
 * Updates the cart badge count in the header
 */
export function initCartBadge() {
  updateBadge();
  window.addEventListener('cart:updated', updateBadge);
  window.addEventListener('content:loaded', updateBadge);
}

async function updateBadge() {
  try {
    const cart = await window.zid?.cart?.get?.();
    const count = cart?.data?.cart?.products_count ?? 0;
    const badges = document.querySelectorAll('[data-cart-badge]');
    badges.forEach((el) => {
      el.textContent = count;
      if (count > 0) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    });
  } catch (_) {}
}
