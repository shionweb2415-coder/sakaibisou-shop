const yen = value => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);
const grid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const chips = document.querySelector("#category-chips");
const emptyState = document.querySelector("#empty-state");
const cart = new Map();

const categories = ["all", ...new Set(PRODUCTS.map(p => p.category))];
categories.slice(1).forEach(category => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  categoryFilter.append(option);
});
function renderChips() {
  chips.innerHTML = "";
  categories.forEach(category => {
    const button = document.createElement("button");
    button.className = "chip" + (categoryFilter.value === category ? " active" : "");
    button.textContent = category === "all" ? "すべて" : category;
    button.addEventListener("click", () => {
      categoryFilter.value = category;
      renderChips();
      renderProducts();
    });
    chips.append(button);
  });
}
function renderProducts() {
  const q = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const shown = PRODUCTS.filter(p => {
    const matchesText = `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q);
    return matchesText && (category === "all" || p.category === category);
  });
  grid.innerHTML = "";
  emptyState.hidden = shown.length !== 0;
  shown.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrap">
        <img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy"
          onerror="this.onerror=null;this.src='assets/product-placeholder.svg'">
        ${product.tag ? `<span class="product-tag">${escapeHTML(product.tag)}</span>` : ""}
        <button class="quick-add" aria-label="${escapeHTML(product.name)}をカートに追加">＋</button>
      </div>
      <div class="product-info">
        <span class="product-category">${escapeHTML(product.category)}</span>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <div class="product-bottom"><strong>${yen(product.price)}</strong><button class="text-add">カートに追加 <span>→</span></button></div>
      </div>`;
    card.querySelector(".quick-add").addEventListener("click", () => addToCart(product.id));
    card.querySelector(".text-add").addEventListener("click", () => addToCart(product.id));
    grid.append(card);
  });
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  const openButton = document.querySelector("#open-cart");
  openButton.classList.remove("bump");
  void openButton.offsetWidth;
  openButton.classList.add("bump");
}
function changeQuantity(id, delta) {
  const next = (cart.get(id) || 0) + delta;
  if (next <= 0) cart.delete(id); else cart.set(id, next);
  renderCart();
}
function renderCart() {
  const count = [...cart.values()].reduce((sum, qty) => sum + qty, 0);
  const total = [...cart.entries()].reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#cart-total").textContent = yen(total);
  document.querySelector("#modal-total").textContent = yen(total);
  const list = document.querySelector("#cart-items");
  list.innerHTML = "";
  if (!cart.size) {
    list.innerHTML = '<div class="cart-empty"><span>🛒</span><h3>カートは空です</h3><p>気になる商品を追加してみてください。</p></div>';
    return;
  }
  cart.forEach((qty, id) => {
    const p = PRODUCTS.find(product => product.id === id);
    if (!p) return;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${escapeHTML(p.image)}" alt="" onerror="this.onerror=null;this.src='assets/product-placeholder.svg'">
      <div class="cart-item-info"><h3>${escapeHTML(p.name)}</h3><strong>${yen(p.price)}</strong>
      <div class="quantity-control"><button aria-label="数量を減らす">−</button><span>${qty}</span><button aria-label="数量を増やす">＋</button><button class="remove-item">削除</button></div></div>`;
    const buttons = row.querySelectorAll(".quantity-control button");
    buttons[0].addEventListener("click", () => changeQuantity(id, -1));
    buttons[1].addEventListener("click", () => changeQuantity(id, 1));
    buttons[2].addEventListener("click", () => { cart.delete(id); renderCart(); });
    list.append(row);
  });
}
const drawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
function openCart() {
  overlay.hidden = false;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}
function closeCart() {
  overlay.hidden = true;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}
document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", () => { renderChips(); renderProducts(); });
document.querySelector("#demo-checkout").addEventListener("click", () => {
  if (!cart.size) {
    document.querySelector("#cart-items").innerHTML = '<div class="cart-empty"><h3>カートが空です</h3><p>商品を追加してからお試しください。</p></div>';
    return;
  }
  closeCart();
  document.querySelector("#demo-modal").hidden = false;
});
document.querySelector("#close-modal").addEventListener("click", () => document.querySelector("#demo-modal").hidden = true);
document.querySelector("#back-to-shop").addEventListener("click", () => document.querySelector("#demo-modal").hidden = true);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeCart(); document.querySelector("#demo-modal").hidden = true; }
});
renderChips();
renderProducts();
renderCart();
