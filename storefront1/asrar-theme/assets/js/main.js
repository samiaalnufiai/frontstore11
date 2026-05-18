/**
 * Asrar Al-Einaya Theme — Main JS Entry
 * Handles: cart badge, wishlist, add-to-cart, quick-view, notify-me, search
 */

import { initCartBadge } from './cart/badge.js';
import { initAddToCart } from './cart/add-to-cart.js';
import { initWishlist } from './features/wishlist.js';
import { initQuantityInputs } from './features/quantity.js';
import { waitForZid } from './utils/zid.js';

async function init() {
  await waitForZid();
  initCartBadge();
  initAddToCart();
  initWishlist();
  initQuantityInputs();
  initLoginButton();
  initSearchKeyboard();
}

// Login/Profile button toggle based on auth state
function initLoginButton() {
  const loginBtn = document.getElementById('header-login-btn');
  const profileBtn = document.getElementById('header-profile-btn');
  if (!loginBtn || !profileBtn) return;

  const profileUrl = window.layoutConfig?.profileUrl;

  window.zid?.customer?.isLoggedIn?.()
    .then((loggedIn) => {
      if (loggedIn) {
        loginBtn.setAttribute('hidden', '');
        profileBtn.removeAttribute('hidden');
        profileBtn.style.display = 'inline-flex';
        loginBtn.style.display = 'none';
      }
    })
    .catch(() => {});
}

// handleLoginAction — called from header button onclick
window.handleLoginAction = function () {
  window.zid?.customer?.isLoggedIn?.()
    .then((loggedIn) => {
      if (loggedIn) {
        window.location.href = window.layoutConfig?.profileUrl || '/profile';
      } else {
        window.zid?.login?.showDialog?.() || (window.location.href = '/login');
      }
    })
    .catch(() => {
      window.location.href = '/login';
    });
};

// Escape key closes overlays
function initSearchKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('search-overlay')?.classList.remove('open');
      document.getElementById('mobile-drawer')?.classList.remove('open');
    }
  });
}

// Dispatch content:loaded on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  init();
  window.dispatchEvent(new CustomEvent('content:loaded'));
});
