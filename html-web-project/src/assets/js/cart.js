// src/js/cart.js — Carrito SIN imágenes y persistencia en localStorage

// --- helpers de storage ---
function getCart() {
  // Soporta 'carrito' (viejo) o 'cart' (nuevo)
  const a = JSON.parse(localStorage.getItem("cart") || "[]");
  if (Array.isArray(a) && a.length) return a;
  const b = JSON.parse(localStorage.getItem("carrito") || "[]");
  return Array.isArray(b) ? b : [];
}

function setCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
  // opcional: sincroniza también la clave vieja
  localStorage.setItem("carrito", JSON.stringify(items));
}

function fmt(n) {
  return Number(n || 0).toLocaleString("es-CO");
}

// --- render del carrito (SIN <img>) ---
function renderCart() {
  const cont = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!cont) return;

  const items = getCart();
  cont.innerHTML = "";

  if (!items.length) {
    cont.innerHTML = "<p>El carrito está vacío 🛒</p>";
    if (totalEl) totalEl.textContent = "0";
    return;
  }

  let total = 0;

  items.forEach((item, i) => {
    const precio = Number(item.precio || 0);
    const cant = Number(item.cantidad || 1);
    total += precio * cant;

    const row = document.createElement("div");
    row.className = "card mb-3 p-3 d-flex flex-row align-items-center gap-3";

    // 👇 SIN imagen: solo texto y botones
    row.innerHTML = `
      <div class="flex-grow-1">
        <h5 class="mb-1">${item.nombre}</h5>
        <div class="text-muted">Precio: $${fmt(precio)}</div>
        <div class="text-muted">Cantidad: ${fmt(cant)}</div>
      </div>

      <div class="btn-group">
        <button class="btn btn-sm btn-success" data-action="plus" aria-label="Aumentar">+</button>
        <button class="btn btn-sm btn-success" data-action="minus" aria-label="Disminuir">-</button>
        <button class="btn btn-sm btn-danger"  data-action="del" aria-label="Eliminar">Eliminar</button>
      </div>
    `;

    row.querySelector("[data-action='plus']").onclick = () => {
      items[i].cantidad = cant + 1;
      setCart(items);
      renderCart();
    };

    row.querySelector("[data-action='minus']").onclick = () => {
      items[i].cantidad = Math.max(1, cant - 1);
      setCart(items);
      renderCart();
    };

    row.querySelector("[data-action='del']").onclick = () => {
      items.splice(i, 1);
      setCart(items);
      renderCart();
    };

    cont.appendChild(row);
  });

  if (totalEl) totalEl.textContent = fmt(total);
}

/// --- checkout REAL: llama a /checkout y descuenta stock en BD ---
import { API_URL } from "./config.js";

async function checkout() {
  const items = getCart();
  if (!items.length) {
    alert("¡Tu carrito está vacío!");
    return;
  }

  // Solo enviamos id y cantidad (el precio real lo toma el backend)
  const payload = {
    clienteId: null,            // o el id del usuario si tienes login
    metodoPago: "Efectivo",     // o "Tarjeta", etc.
    items: items.map(x => ({
      id: Number(x.id),
      cantidad: Number(x.cantidad || 1)
    }))
  };

  try {
    const resp = await fetch(`${API_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      alert(data.mensaje || "No se pudo confirmar el pedido");
      return;
    }

    // Éxito: se registró la venta y se descontó el stock en la BD
    alert(`Pedido confirmado. N° venta: ${data.venta.id} — Total: $${fmt(data.venta.total)}`);

    // Vacía carrito y repinta
    setCart([]);
    renderCart();

    // Aviso global (otras pestañas/páginas escuchan y repiden /productos)
    localStorage.setItem("lastCheckout", String(Date.now()));

  } catch (e) {
    console.error("checkout error", e);
    alert("Error procesando el pedido. Intenta de nuevo.");
  }
}

// deja visible para otros scripts si lo usas desde HTML
window.checkout = checkout;


