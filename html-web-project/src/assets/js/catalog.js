// src/js/catalog.js
import { API_URL } from "./config.js";

// Resolver seguro de URL de imagen (soporta varias fuentes)
function resolverImagen(p) {
  const raw = p?.imagenUrl || p?.imagen || "";
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  // Si la ruta es absoluta en el servidor (empieza por /), usar el origen del backend
  try {
    const backendOrigin = new URL(API_URL).origin;
    if (raw.startsWith("/")) return backendOrigin + raw;
    if (raw.startsWith("uploads/") || raw.startsWith("assets/")) return `${backendOrigin}/${raw}`;
    // intentamos primero la carpeta local del frontend (cuando se abre index/catalog localmente)
    const local = `../assets/img/productos/${raw}`;
    // si la página está siendo servida desde el mismo host que el backend, preferimos la ruta backend
    if (location && backendOrigin && new URL(backendOrigin).hostname === location.hostname) {
      return `${backendOrigin}/assets/img/productos/${raw}`;
    }
    return local;
  } catch (e) {
    // si algo falla, devolver ruta local como fallback
    return `../assets/img/productos/${raw}`;
  }
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

    // en catalog.js al agregar (no añadir automáticamente: solo preparamos la URL correcta)
    addToCart({
      id: p.id,
      nombre: p.nombre,
      precio: Number(p.precio),
      imagen: resolverImagen(p)
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

