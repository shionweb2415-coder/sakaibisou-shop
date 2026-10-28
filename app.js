let cart = 0;
const grid = document.getElementById("product-grid");
const toast = document.getElementById("toast");
function renderProducts(category="all"){
  grid.innerHTML = products.filter(p=>category==="all"||p.category===category).map(p=>`
    <article class="product-card">
      <div class="product-art"><img src="img/product${p.id}.png" alt="${p.name}" style="width:100%;height:100%;object-fit:contain"></div>
      <div class="eyebrow">${p.categoryName}</div><h3>${p.name}</h3><p>${p.description}</p>
      <div class="product-bottom"><span class="price">¥${p.price.toLocaleString("ja-JP")} <small>（仮価格）</small></span><button class="add" aria-label="${p.name}をカートに追加" data-add="${p.id}">＋</button></div>
    </article>`).join("");
}
document.addEventListener("click",e=>{
  const filter=e.target.closest("[data-category]");
  if(filter){document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));filter.classList.add("active");renderProducts(filter.dataset.category);}
  const add=e.target.closest("[data-add]");
  if(add){cart++;document.getElementById("cart-count").textContent=cart;toast.textContent="カートに追加しました（デモ）";toast.style.display="block";setTimeout(()=>toast.style.display="none",1800);}
});
document.getElementById("cart-button").addEventListener("click",()=>{alert(`カート内の商品数：${cart}\nこれは試作品のため、注文・決済はできません。`);});
renderProducts();