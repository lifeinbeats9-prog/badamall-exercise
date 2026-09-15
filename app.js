let products = [];
let cartCount = 0;

const grid = document.querySelector('#productGrid');
const resultText = document.querySelector('#resultText');
const toast = document.querySelector('#toast');

function won(value){ return new Intl.NumberFormat('ko-KR').format(value) + '원'; }
function showToast(message){ toast.textContent = message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), 2200); }

async function loadProducts(){
  const response = await fetch('products.json');
  products = await response.json();
  renderProducts(products);
}

function renderProducts(list){
  resultText.textContent = `총 ${list.length}개의 상품`;
  grid.innerHTML = list.map(item => `
    <article class="product-card">
      <div class="thumb"><span class="badge">${item.badge}</span><img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='images/placeholder.svg'"></div>
      <div class="product-category">${item.category}</div>
      <div class="product-name">${item.name}</div>
      <div class="product-price">${won(item.price)}</div>
      <button class="cart-btn" onclick="addToCart(${item.id})">장바구니 담기</button>
    </article>`).join('');
}

async function addToCart(productId){
  const product = products.find(p => p.id === productId);
  const payload = {
    productId: product.id,
    productName: product.name,
    price: product.price,
    quantity: 1
  };

  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {'Content-Type':'application/json; charset=UTF-8'},
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  cartCount += 1;
  document.querySelector('#cartCount').textContent = cartCount;
  showToast(`서버 전송 성공 · 응답 id: ${result.id}`);
  console.log('전송 JSON:', payload);
  console.log('서버 응답:', result);
}

function applySearch(){
  const q = document.querySelector('#searchInput').value.trim().toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  renderProducts(filtered);
}

document.querySelector('#searchBtn').addEventListener('click', applySearch);
document.querySelector('#searchInput').addEventListener('keydown', e => { if(e.key === 'Enter') applySearch(); });
document.querySelectorAll('.gnb button[data-category]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.gnb button[data-category]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cat = btn.dataset.category;
  if(cat === 'all') return renderProducts(products);
  if(cat === 'BEST') return renderProducts(products.filter(p => p.badge === 'BEST'));
  renderProducts(products.filter(p => p.category === cat));
}));

loadProducts().catch(err => {
  console.error(err);
  resultText.textContent = '상품 데이터를 불러오지 못했습니다.';
});
