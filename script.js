const WHATSAPP = "5511924801221";

const products = [
  {
    id: 1,
    name: "X-Salada",
    price: 22.90,
    description: "Pão brioche, hambúrguer artesanal, queijo, alface, tomate e molho da casa.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2,
    name: "X-Bacon",
    price: 27.90,
    description: "Pão brioche, hambúrguer artesanal, cheddar, bacon crocante e molho especial.",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3,
    name: "Duplo Cheddar",
    price: 31.90,
    description: "Dois hambúrgueres artesanais, cheddar cremoso, cebola caramelizada e molho da casa.",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 4,
    name: "Smash Bacon",
    price: 25.90,
    description: "Smash burger, queijo, bacon, picles e molho especial no pão macio.",
    image: "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 5,
    name: "Chicken Crispy",
    price: 23.90,
    description: "Frango crocante, queijo, alface, tomate e maionese temperada.",
    image: "https://images.unsplash.com/photo-1615297928064-24977384d0c4?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 6,
    name: "Veggie Burger",
    price: 24.90,
    description: "Burger vegetal, queijo, alface, tomate, cebola roxa e molho especial.",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=85"
  }
];

let cart = [];
let selectedProduct = null;

const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const modalBackdrop = document.getElementById("modalBackdrop");
const observationEl = document.getElementById("observation");
const toastEl = document.getElementById("toast");

const money = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function renderProducts() {
  productsEl.innerHTML = products.map(p => `
    <article class="product">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-body">
        <h4>${p.name}</h4>
        <p>${p.description}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add" onclick="openProduct(${p.id})">Adicionar</button>
        </div>
      </div>
    </article>
  `).join("");
}

window.openProduct = function(id) {
  selectedProduct = products.find(p => p.id === id);
  document.getElementById("modalImage").src = selectedProduct.image;
  document.getElementById("modalImage").alt = selectedProduct.name;
  document.getElementById("modalName").textContent = selectedProduct.name;
  document.getElementById("modalDescription").textContent = selectedProduct.description;
  document.getElementById("modalPrice").textContent = money(selectedProduct.price);
  observationEl.value = "";
  modalBackdrop.classList.add("show");
};

function addSelectedToCart() {
  if (!selectedProduct) return;
  const observation = observationEl.value.trim();
  const key = `${selectedProduct.id}::${observation}`;
  const existing = cart.find(i => i.key === key);

  if (existing) existing.quantity++;
  else cart.push({ key, product: selectedProduct, observation, quantity: 1 });

  modalBackdrop.classList.remove("show");
  renderCart();
  showToast(`${selectedProduct.name} adicionado à sacola`);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  cartCountEl.textContent = count;
  cartTotalEl.textContent = money(total);

  if (!cart.length) {
    cartItemsEl.innerHTML = `<div class="empty">Sua sacola está vazia.<br>Escolha um produto para começar.</div>`;
    document.getElementById("checkout").disabled = true;
    return;
  }

  document.getElementById("checkout").disabled = false;
  cartItemsEl.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <h4>${item.quantity}× ${item.product.name}</h4>
        ${item.observation ? `<small>Obs.: ${escapeHtml(item.observation)}</small>` : ""}
        <div class="quantity">
          <button onclick="changeQty(${index}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
        <button class="remove" onclick="removeItem(${index})">Remover</button>
      </div>
      <strong>${money(item.product.price * item.quantity)}</strong>
    </div>
  `).join("");
}

window.changeQty = function(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  renderCart();
};

window.removeItem = function(index) {
  cart.splice(index, 1);
  renderCart();
};

function checkoutWhatsApp() {
  if (!cart.length) return;

  const lines = cart.map(item => {
    const obs = item.observation ? ` — Obs.: ${item.observation}` : "";
    return `${item.quantity}x ${item.product.name}${obs}`;
  });

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const message =
`Olá! Gostaria de fazer um pedido:

${lines.join("\n")}

Total: ${money(total)}

Gostaria de confirmar o pedido.`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

let toastTimer;
function showToast(text) {
  clearTimeout(toastTimer);
  toastEl.textContent = text;
  toastEl.classList.add("show");
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

document.getElementById("addToCart").addEventListener("click", addSelectedToCart);
document.getElementById("checkout").addEventListener("click", checkoutWhatsApp);
document.getElementById("openCart").addEventListener("click", () => cartEl.classList.add("open"));
document.getElementById("closeCart").addEventListener("click", () => cartEl.classList.remove("open"));
document.getElementById("modalClose").addEventListener("click", () => modalBackdrop.classList.remove("show"));
modalBackdrop.addEventListener("click", e => {
  if (e.target === modalBackdrop) modalBackdrop.classList.remove("show");
});

renderProducts();
renderCart();
