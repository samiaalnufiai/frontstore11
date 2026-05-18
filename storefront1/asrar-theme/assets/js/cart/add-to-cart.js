/**
 * Add to Cart — handles data-add-to-cart and data-add-to-cart-form
 * Asrar Al-Einaya Theme
 */

export function initAddToCart() {
  document.addEventListener('click', handleCartClick);
  window.addEventListener('content:loaded', () => {
    document.addEventListener('click', handleCartClick);
  });
}

async function handleCartClick(e) {
  // Simple add-to-cart (no options)
  const addBtn = e.target.closest('[data-add-to-cart]');
  if (addBtn) {
    e.preventDefault();
    const productId = addBtn.dataset.addToCart;
    await addSimpleProduct(addBtn, productId);
    return;
  }

  // Form add-to-cart (with options/fields)
  const formBtn = e.target.closest('[data-add-to-cart-form]');
  if (formBtn) {
    e.preventDefault();
    const formId = formBtn.dataset.addToCartForm;
    await addFormProduct(formBtn, formId, false);
    return;
  }

  // Buy now (form)
  const buyNowBtn = e.target.closest('[data-buy-now-form]');
  if (buyNowBtn) {
    e.preventDefault();
    const formId = buyNowBtn.dataset.buyNowForm;
    await addFormProduct(buyNowBtn, formId, true);
    return;
  }

  // Buy now (simple)
  const buySimple = e.target.closest('[data-buy-now]');
  if (buySimple) {
    e.preventDefault();
    const productId = buySimple.dataset.buyNow;
    await addSimpleProduct(buySimple, productId, true);
    return;
  }
}

async function addSimpleProduct(btn, productId, buyNow = false) {
  if (!productId || btn.disabled) return;
  setLoading(btn, true);

  try {
    await window.zid.cart.addProduct(
      { product_id: productId, quantity: 1 },
      { showErrorNotification: true }
    );
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { productId } }));

    if (buyNow) {
      window.location.href = '/checkout';
      return;
    }

    // Show quantity section, hide add button
    const card = btn.closest('[data-product-card]');
    if (card) {
      btn.setAttribute('hidden', '');
      const qtySection = card.querySelector('[data-quantity-section]');
      qtySection?.removeAttribute('hidden');
      qtySection?.style?.setProperty('display', 'block');
    }
  } catch (err) {
    console.error('[Asrar] Add to cart error:', err);
  } finally {
    setLoading(btn, false);
  }
}

async function addFormProduct(btn, formId, buyNow = false) {
  const form = document.getElementById(formId);
  if (!form || btn.disabled) return;

  setLoading(btn, true);
  try {
    const formData = new FormData(form);
    const productId = formData.get('product_id');
    const options = {};
    for (const [key, val] of formData.entries()) {
      if (key.startsWith('options[')) {
        const optId = key.replace('options[', '').replace(']', '');
        options[optId] = val;
      }
    }
    const fields = {};
    for (const [key, val] of formData.entries()) {
      if (key.startsWith('fields[')) {
        const fId = key.replace('fields[', '').replace(']', '');
        fields[fId] = val;
      }
    }

    await window.zid.cart.addProduct(
      { product_id: productId, quantity: 1, options, fields },
      { showErrorNotification: true }
    );
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { productId } }));

    if (buyNow) {
      window.location.href = '/checkout';
      return;
    }

    // Show qty section on product detail
    const detail = btn.closest('.asrar-product-add-section');
    if (detail) {
      const qtySection = detail.querySelector('[data-quantity-section]');
      if (qtySection) {
        qtySection.style.display = 'block';
        btn.textContent = '✓ ' + btn.textContent.trim();
        btn.disabled = true;
      }
    }
  } catch (err) {
    console.error('[Asrar] Add to cart (form) error:', err);
  } finally {
    setLoading(btn, false);
  }
}

function setLoading(btn, state) {
  btn.disabled = state;
  if (state) {
    btn.dataset.originalText = btn.textContent;
    btn.classList.add('loading');
  } else {
    btn.classList.remove('loading');
    if (btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
  }
}
