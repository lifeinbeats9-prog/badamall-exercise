const ASSET = name => `assets/${name}`;
const heroImages = [
  'b228ba98-4e65-4a01-97ad-1867b0cacf0c.jpeg',
  '167b32af-72e7-4821-dce9-ee1cc3e4d9eb.jpeg',
  '7c90cf1a-921a-4e7f-c1e8-d9f5c1493380.jpeg',
  '1f132bd2-5c7c-4f9e-c58a-87845548f62b.jpeg',
  'f2445dc9-20d4-42bb-bcfd-930e1d28dfc4.jpeg',
  '8cdb1fbb-2c5a-4f8d-84a2-d5a9411f56b9.jpeg',
  '375a1d5a-f1f2-4f71-9bc8-fb009af8b3f7.jpeg'
];
let slideIndex = 0;
let slideTimer;

function initHero(){
  const box=document.querySelector('#heroSlides');
  const dots=document.querySelector('#heroDots');
  heroImages.forEach((src,i)=>{
    const div=document.createElement('div');
    div.className='hero-slide'+(i===0?' active':'');
    div.innerHTML=`<img src="${ASSET(src)}" alt="바다몰 메인 배너 ${i+1}">`;
    box.appendChild(div);
    const dot=document.createElement('button');
    dot.className=i===0?'active':'';
    dot.setAttribute('aria-label',`${i+1}번 배너`);
    dot.onclick=()=>showSlide(i);
    dots.appendChild(dot);
  });
  document.querySelector('.hero-arrow.prev').onclick=()=>showSlide(slideIndex-1);
  document.querySelector('.hero-arrow.next').onclick=()=>showSlide(slideIndex+1);
  slideTimer=setInterval(()=>showSlide(slideIndex+1),4500);
}
function showSlide(n){
  const slides=[...document.querySelectorAll('.hero-slide')];
  const dots=[...document.querySelectorAll('.hero-dots button')];
  slideIndex=(n+slides.length)%slides.length;
  slides.forEach((x,i)=>x.classList.toggle('active',i===slideIndex));
  dots.forEach((x,i)=>x.classList.toggle('active',i===slideIndex));
}
function won(n){return Number(n).toLocaleString('ko-KR')+'원'}
function badgeClass(text){const t=text.toLowerCase();return t.includes('hot')?'hot':t.includes('new')?'new':''}
function productCard(p,type){
  const badges=(p.badges||[]).map(b=>`<span class="badge ${badgeClass(b)}">${b}</span>`).join('');
  return `<article class="product-card" data-product-id="${p.id}">
    <div class="product-thumb">
      <div class="rank">${type==='new'?'NEW':'BEST'}<strong>${String(p.rank).padStart(2,'0')}</strong></div>
      <img src="${ASSET(p.image)}" alt="바다몰 ${p.name}">
      <button class="cart-button" type="button" data-cart="${p.id}" aria-label="${p.name} 장바구니 담기"><img src="${ASSET('btn_list_cart.gif')}" alt="장바구니 담기"></button>
    </div>
    <div class="product-name">${p.name}</div><div class="product-price">${won(p.price)}</div><div class="badges">${badges}</div>
  </article>`;
}
async function loadProducts(){
  const newBox=document.querySelector('#newProducts');
  const bestBox=document.querySelector('#bestProducts');
  try{
    const response=await fetch('./products.json',{cache:'no-store'});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const data=await response.json();
    newBox.innerHTML=data.newProducts.map(p=>productCard(p,'new')).join('');
    bestBox.innerHTML=data.bestProducts.map(p=>productCard(p,'best')).join('');
  }catch(error){
    const msg='<p style="padding:30px;text-align:center">상품 데이터를 불러오지 못했습니다. 로컬에서는 HTTP 서버로 실행해 주세요.</p>';
    newBox.innerHTML=msg;bestBox.innerHTML=msg;console.error(error);
  }
}
async function postCart(productId){
  const payload={productId:Number(productId),quantity:1,source:'badamall-exercise',createdAt:new Date().toISOString()};
  try{
    const response=await fetch('https://jsonplaceholder.typicode.com/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json();
    showToast(`장바구니 요청 완료 · 응답 id ${result.id ?? '-'}`);
    console.log('POST payload',payload,'response',result);
  }catch(e){showToast('장바구니 요청을 전송했습니다.');console.error(e)}
}
function showToast(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
document.addEventListener('click',e=>{const btn=e.target.closest('[data-cart]');if(btn)postCart(btn.dataset.cart)});
document.addEventListener('DOMContentLoaded',()=>{initHero();loadProducts()});
