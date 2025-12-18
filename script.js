async function loadProducts() {
  const res = await fetch('/api/admin');
  const products = await res.json();

  const container = document.getElementById('products');
  container.innerHTML = '';

  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <h3>${p.name}</h3>
        <p>R$ ${p.price}</p>
        <button onclick="buy(${p.id})">Comprar</button>
      </div>
    `;
  });
}

async function buy(productId) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ productId })
  });

  const data = await res.json();

  document.getElementById('pixQr').src =
    'data:image/png;base64,' + data.qrCodeBase64;

  document.getElementById('pixModal').style.display = 'block';

  const interval = setInterval(async () => {
    const r = await fetch('/api/status?id=' + data.id);
    const v = await r.json();

    if (v.paid) {
      clearInterval(interval);
      alert('Produto liberado:\n' + v.delivery);
    }
  }, 4000);
}

loadProducts();
