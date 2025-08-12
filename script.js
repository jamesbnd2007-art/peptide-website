/*
  JavaScript for Peptide Lab website

  Handles age verification overlay, product listing, cart functionality,
  and dynamic content updates across different pages.
*/

// Product catalogue: update or extend this array with additional peptides.
const products = [
  {
    id: 'bpc157',
    name: 'BPC‑157',
    description: 'A synthetic peptide commonly studied for its potential role in tissue repair and regeneration.',
    price: 49.99,
    image: 'images/product.png'
  },
  {
    id: 'cjc1295',
    name: 'CJC‑1295',
    description: 'Peptide analogue used in research to explore growth hormone release.',
    price: 59.99,
    image: 'images/product.png'
  },
  {
    id: 'tb500',
    name: 'TB‑500',
    description: 'Research peptide derived from thymosin beta‑4, investigated for its involvement in cell migration.',
    price: 54.99,
    image: 'images/product.png'
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    description: 'A pentapeptide being studied for its selective stimulation of growth hormone secretion.',
    price: 44.99,
    image: 'images/product.png'
  }
];

/**
 * Retrieve cart array from localStorage. Returns an empty array if none exists.
 * @returns {Array<{id:string, quantity:number}>}
 */
function getCart() {
  const cartJSON = localStorage.getItem('cart');
  return cartJSON ? JSON.parse(cartJSON) : [];
}

/**
 * Save cart array to localStorage.
 * @param {Array<{id:string, quantity:number}>} cart
 */
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Update the cart count displayed in the header.
 */
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.textContent = total.toString();
  }
}

/**
 * Add a product to the cart by id. If the item exists, increments its quantity.
 * @param {string} productId
 */
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert('Added to cart');
}

/**
 * Remove an item from the cart completely.
 * @param {string} productId
 */
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCount();
  displayCart();
}

/**
 * Render the product grid on the products page.
 */
function displayProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  let html = '';
  products.forEach(product => {
    html += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">$${product.price.toFixed(2)}</div>
        <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    `;
  });
  grid.innerHTML = html;
}

/**
 * Display the cart items on the cart page.
 */
function displayCart() {
  const container = document.querySelector('.cart-items');
  const summary = document.querySelector('.cart-summary');
  if (!container || !summary) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    summary.textContent = '';
    return;
  }
  let html = '';
  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    const itemTotal = product.price * item.quantity;
    total += itemTotal;
    html += `
      <div class="cart-item-row">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-item-details">
          <h3>${product.name}</h3>
          <div class="price">$${product.price.toFixed(2)} x ${item.quantity}</div>
        </div>
        <div class="cart-item-actions">
          <button onclick="removeFromCart('${product.id}')">Remove</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
  summary.innerHTML = `Total: <strong>$${total.toFixed(2)}</strong>`;
}

/**
 * Handle age verification overlay on page load.
 */
function handleAgeVerification() {
  const overlay = document.getElementById('age-overlay');
  if (!overlay) return;
  const ageVerified = localStorage.getItem('ageVerified') === 'true';
  if (!ageVerified) {
    overlay.classList.add('open');
  }
  const yesBtn = document.getElementById('btn-age-yes');
  const noBtn = document.getElementById('btn-age-no');
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      localStorage.setItem('ageVerified', 'true');
      overlay.classList.remove('open');
    });
  }
  if (noBtn) {
    noBtn.addEventListener('click', () => {
      alert('You must be over 18 to access this site.');
      // Keep overlay visible to block access
    });
  }
}

// Initialise page functions on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  handleAgeVerification();
  updateCartCount();
  displayProducts();
  displayCart();
});