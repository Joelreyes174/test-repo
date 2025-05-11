    const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMyE1eqOKwxRgLjNHwV8Kx6Ky043J9kqhi04wnXOxFyHz_SRjMcvmFw8PV6ZarRKFuZSx25WeB5YzW/pub?output=tsv';

    async function loadProducts() {
      try {
        const res = await fetch(sheetURL);
        const text = await res.text();
        const rows = text.trim().split('\n').map(row => row.split('\t'));
        const headers = rows.shift().map(h => h.trim().toLowerCase());
        const productGrid = document.getElementById('productGrid');

        rows.forEach((row, index) => {
          const product = Object.fromEntries(headers.map((key, i) => [key, row[i]?.trim() || '']));
          if (!product.name || !product.price) return;

          const slug = encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'));

          const div = document.createElement('div');
          div.className = 'product';
          div.innerHTML = `
            <a href="product_page.html?id=${slug}">
              <img src="${product.image || 'https://via.placeholder.com/150?text=No+Image'}" alt="${product.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150?text=No+Image';" />
              <h3>${product.name}</h3>
              <p>$${product.price}</p>
            </a>
          `;
          productGrid.appendChild(div);
        });
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    }

    loadProducts();