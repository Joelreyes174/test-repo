const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMyE1eqOKwxRgLjNHwV8Kx6Ky043J9kqhi04wnXOxFyHz_SRjMcvmFw8PV6ZarRKFuZSx25WeB5YzW/pub?output=tsv';
const params = new URLSearchParams(window.location.search);
const productSlug = params.get('id');

let productGroup = [];

async function loadProduct() {
  const res = await fetch(sheetURL);
  const text = await res.text();
  const rows = text.trim().split('\n').map(row => row.split('\t'));
  const headers = rows.shift().map(h => h.trim().toLowerCase());

  const products = rows.map(row =>
    Object.fromEntries(headers.map((key, i) => [key, row[i]?.trim() || '']))
  );

  productGroup = products.filter(p =>
    p.name.toLowerCase().replace(/\s+/g, '-') === decodeURIComponent(productSlug)
  );

  if (!productGroup.length) {
    document.getElementById('productContainer').innerHTML = '<p>Product not found.</p>';
    return;
  }

  renderVariant(productGroup[0]); // default to first variant
}

function renderVariant(product) {
  const container = document.getElementById('productContainer');
  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];

  const thumbnails = productGroup.map(p => `
    <img src="${p.image}" onclick="renderVariant(${JSON.stringify(p).replace(/"/g, '&quot;')})" class="thumbnail" />
  `).join('');

  container.innerHTML = `
    <div class="product-image">
      <img id="mainImage" src="${product.image}" alt="${product.name} - ${product.style}" />
      <div class="thumbnail-row">${thumbnails}</div>
    </div>
    <div class="product-details">
      <h1>${product.name} - ${product.style}</h1>
      <div class="price">$${product.price}</div>
      <div class="sizes">
        <label for="size">Size:</label>
        <select id="size">
          ${sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
        </select>
      </div>
      <div class="description">${product.description || 'No description available.'}</div>
      <button onclick="alert('Added to cart!')">Add to Cart</button>
    </div>
  `;
}

loadProduct();

