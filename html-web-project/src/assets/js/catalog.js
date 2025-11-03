// src/js/catalog.js
import { API_URL } from "./config.js";

// Resolver seguro de URL de imagen (soporta varias fuentes)
function resolverImagen(p) {
  const raw = p?.imagenUrl || p?.imagen || "";
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return `${API_URL}${raw}`;
  if (raw.startsWith("uploads/") || raw.startsWith("assets/")) return `${API_URL}/${raw}`;
  // fallback a carpeta de productos en backend si sólo viene el nombre
  return `${API_URL}/assets/img/productos/${raw}`;
}

function pintarCatalogo(productos) {
  catalogoEl.innerHTML = "";
  productos.forEach((p) => {
    const imgSrc = resolverImagen(p);
    const card = document.createElement("div");
    card.className = "card mb-3 p-3 d-flex flex-row gap-3 align-items-center";
    card.innerHTML = `
      ${imgSrc ? `<img src="${imgSrc}" alt="${p.nombre}"
           style="width:92px;height:92px;object-fit:cover;border-radius:8px" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns='\''http://www.w3.org/2000/svg'\'' width='\''300'\'' height='\''200'\''><rect width='\''100%\'' height='\''100%\'' fill='%23e0e0e0'/><text x='\''50%\'' y='\''50%\'' dominant-baseline='\''middle'\'' text-anchor='\''middle'\'' fill='%23666' font-family='\''Arial'\'' font-size='\''20'\''>Sin imagen</text></svg>'">` : ""}
      <div class="flex-grow-1">
        <h5 class="mb-1">${p.nombre}</h5>
        <div class="text-muted">Precio: $${Number(p.precio).toLocaleString()}</div>
        <div class="text-muted">Stock: ${p.stock ?? "-"}</div>
      </div>
      <button class="btn btn-primary btn-sm">Agregar</button>
    `;

    // en catalog.js al agregar
    addToCart({
      id: p.id,
      nombre: p.nombre,
      precio: Number(p.precio),
      imagen: p.imagenUrl || `${API_URL}/assets/img/productos/${p.imagen}`
    });

    catalogoEl.appendChild(card);
  });
}

// 🔻 Añade este bloque al FINAL del archivo

// Cuando otra pestaña/página confirme un pedido, refresca el catálogo 
window.addEventListener("storage", (e) => {
  if (e.key === "lastCheckout" && e.newValue) {
    // vuelve a pedir /productos y repinta
    if (typeof cargarProductos === "function") {
      cargarProductos();
    } else {
      location.reload(); // fallback
    }
  }
});

// (opcional) si quieres refrescar también al volver a la pestaña:
window.addEventListener("focus", () => {
  if (typeof cargarProductos === "function") cargarProductos();
});

