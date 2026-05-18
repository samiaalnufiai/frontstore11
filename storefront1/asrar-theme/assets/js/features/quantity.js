/**
 * Quantity controls for product cards (not cart page)
 * Cart page uses cart/controller.js
 */
export function initQuantityInputs() {
  document.addEventListener('click', async (e) => {
    const isCartPage = document.body.dataset.template === 'cart_page';
    if (isCartPage) return;

    const decreaseBtn = e.target.closest('[data-qty-decrease]');
    if (decreaseBtn) {
      const productId = decreaseBtn.dataset.productId;
      const input = decreaseBtn.closest('[data-quantity-section]')?.querySelector('[data-qty-input]');
      const current = parseInt(input?.value || '1');

      if (current <= 1) {
        // Remove from cart & hide qty, show add-to-cart
        try {
          await window.zid?.cart?.removeProduct?.({ product_id: productId });
          window.dispatchEvent(new CustomEvent('cart:updated'));
          const card = decreaseBtn.closest('[data-product-card]');
          if (card) {
            const qtySection = card.querySelector('[data-quantity-section]');
            const addBtn = card.querySelector('[data-add-to-cart]');
            qtySection?.setAttribute('hidden', '');
            addBtn?.removeAttribute('hidden');
          }
        } catch (_) {}
      } else {
        const newQty = current - 1;
        try {
          await window.zid?.cart?.updateProduct?.({ product_id: productId, quantity: newQty });
          if (input) input.value = newQty;
          window.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (_) {}
      }
    }

    const increaseBtn = e.target.closest('[data-qty-increase]');
    if (increaseBtn) {
      const productId = increaseBtn.dataset.productId;
      const input = increaseBtn.closest('[data-quantity-section]')?.querySelector('[data-qty-input]');
      const current = parseInt(input?.value || '1');
      const newQty = current + 1;
      try {
        await window.zid?.cart?.updateProduct?.({ product_id: productId, quantity: newQty });
        if (input) input.value = newQty;
        window.dispatchEvent(new CustomEvent('cart:updated'));
      } catch (_) {}
    }
  });
}
