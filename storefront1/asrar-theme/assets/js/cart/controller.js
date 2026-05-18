/**
 * Cart Page Controller — Asrar Al-Einaya Theme
 * Required window callbacks for Vitrin cart integration
 */

import { waitForZid } from '../utils/zid.js';

// ── Vitrin Required Callbacks ──────────────────────
window.cartProductsHtmlChanged = function () {
  syncCartTotals();
  initQtyControls();
};

window.CartPage = {
  refresh: function () {
    syncCartTotals();
    initQtyControls();
  },
};

window.toggleBundleItems = function (productId, show) {
  // Bundle items visibility — handled by Vitrin
};

window.refreshCartPage = function () {
  window.location.reload();
};

// ── Init ───────────────────────────────────────────
async function init() {
  await waitForZid();
  syncCartTotals();
  initQtyControls();
  initCoupon();
}

// ── Cart Totals Sync ───────────────────────────────
async function syncCartTotals() {
  try {
    const res = await window.zid?.cart?.get?.();
    const cart = res?.data?.cart;
    if (!cart) return;

    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = cart.subtotal || '—';
    if (totalEl) totalEl.textContent = cart.total || '—';

    // Show/hide empty state
    const emptyState = document.getElementById('cart-empty-state');
    if (emptyState) {
      const hasProducts = cart.products_count > 0;
      emptyState.hidden = hasProducts;
    }
  } catch (_) {}
}

// ── Quantity Controls ──────────────────────────────
function initQtyControls() {
  document.querySelectorAll('[data-qty-decrease]').forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true)); // remove old listeners
  });

  document.querySelectorAll('[data-qty-decrease]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const productId = btn.dataset.productId;
      const input = document.querySelector(`[data-qty-input][data-product-id="${productId}"]`);
      const current = parseInt(input?.value || '1');

      if (current <= 1) {
        await removeProduct(productId);
      } else {
        await updateQty(productId, current - 1, input);
      }
    });
  });

  document.querySelectorAll('[data-qty-increase]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const productId = btn.dataset.productId;
      const input = document.querySelector(`[data-qty-input][data-product-id="${productId}"]`);
      const current = parseInt(input?.value || '1');
      await updateQty(productId, current + 1, input);
    });
  });
}

async function updateQty(productId, qty, inputEl) {
  try {
    await window.zid.cart.updateProduct({ product_id: productId, quantity: qty });
    if (inputEl) inputEl.value = qty;
    window.dispatchEvent(new CustomEvent('cart:updated'));
    syncCartTotals();
  } catch (_) {}
}

async function removeProduct(productId) {
  try {
    await window.zid.cart.removeProduct({ product_id: productId });
    window.dispatchEvent(new CustomEvent('cart:updated'));
    syncCartTotals();
  } catch (_) {}
}

// ── Coupon ─────────────────────────────────────────
function initCoupon() {
  const applyBtn = document.getElementById('apply-coupon-btn');
  if (!applyBtn) return;

  applyBtn.addEventListener('click', async () => {
    const input = document.getElementById('coupon-input');
    const msgEl = document.getElementById('coupon-message');
    const code = input?.value?.trim();
    if (!code) return;

    applyBtn.disabled = true;
    try {
      await window.zid.cart.applyCoupon({ coupon: code });
      if (msgEl) {
        msgEl.textContent = '✓ تم تطبيق الكوبون';
        msgEl.style.color = 'var(--success)';
        msgEl.style.display = 'block';
      }
      syncCartTotals();
    } catch (err) {
      if (msgEl) {
        msgEl.textContent = err?.message || 'كوبون غير صالح';
        msgEl.style.color = 'var(--destructive)';
        msgEl.style.display = 'block';
      }
    } finally {
      applyBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
