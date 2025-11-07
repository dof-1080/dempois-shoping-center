window.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.box');

  boxes.forEach((box) => {
    const img = box.querySelector('img');
    const name = img.alt;
    const priceText = box.querySelector('p');
    const price = priceText ? parseInt(priceText.textContent.replace(/\D/g, '')) || 0 : 0;

    // Add "Add to Cart" button
    const btn = document.createElement('button');
    btn.textContent = "Add to Cart";
    btn.style.display = "block";
    btn.style.marginTop = "5px";
    btn.style.background = "#6c5ce7";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.padding = "5px 10px";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";

    btn.onclick = () => addToCart(name, price, img.src);
    box.appendChild(btn);
  });

  showCart();
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price, image) {
  const cart = getCart();
  cart.push({ name, price, image });
  saveCart(cart);
  showCart();
}

function showCart() {
  let cartBox = document.getElementById('cart');
  if (!cartBox) {
    cartBox = document.createElement('div');
    cartBox.id = 'cart';
    document.body.appendChild(cartBox);

    Object.assign(cartBox.style, {
      position: 'fixed',
      top: '70px',
      right: '15px',
      width: '180px',
      maxHeight: '280px',
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: '1000',
      fontSize: '12px'
    });

    cartBox.innerHTML = `
      <h4 style="text-align:center;">Cart</h4>
      <div id="cartItems"></div>
      <p id="total"></p>
      <button id="submitBtn" style="width:100%;background:#6c5ce7;color:white;border:none;padding:6px;border-radius:5px;">Submit</button>
    `;
  }

  const cart = getCart();
  const cartItems = cartBox.querySelector('#cartItems');
  const total = cartBox.querySelector('#total');
  cartItems.innerHTML = '';

  let sum = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    total.textContent = '';
    return;
  }

  cart.forEach((item, index) => {
    sum += item.price;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.marginBottom = '8px';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width:35px;height:35px;border-radius:5px;margin-right:8px;">
      <div style="flex:1;">
        <p style="margin:0;font-size:11px;">${item.name}</p>
        <p style="margin:0;font-weight:bold;font-size:11px;">₦${item.price.toLocaleString()}</p>
      </div>
      <button onclick="removeItem(${index})" style="color:red;border:none;background:none;font-size:13px;">x</button>
    `;
    cartItems.appendChild(div);
  });

  total.textContent = `Total: ₦${sum.toLocaleString()}`;
  document.getElementById('submitBtn').onclick = submitCart;
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  showCart();
}

function submitCart() {
  const cart = getCart();
  if (cart.length === 0) return alert("Your cart is empty!");
  alert("Order submitted successfully!");
  localStorage.removeItem('cart');
  showCart();
}