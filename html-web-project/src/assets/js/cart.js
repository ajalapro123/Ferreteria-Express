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

// Helper para mostrar factura usando SweetAlert2 (usa window.Swal global)
function mostrarFacturaModal(venta, items) {
  const rows = items.map(i => `<tr><td>${i.nombre}</td><td style="text-align:center">${i.cantidad}</td><td style="text-align:right">$${Number(i.precio).toLocaleString()}</td><td style="text-align:right">$${(Number(i.precio)*Number(i.cantidad)).toLocaleString()}</td></tr>`).join('');
  const html = `
    <div style="text-align:left">
      <p><b>N° venta:</b> ${venta.id}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:8px">
        <thead><tr><th>Producto</th><th>Cant.</th><th style="text-align:right">Precio</th><th style="text-align:right">Subtotal</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td colspan="3" style="text-align:right"><b>Total</b></td><td style="text-align:right"><b>$${Number(venta.total).toLocaleString()}</b></td></tr></tfoot>
      </table>
    </div>`;

  Swal.fire({ title: 'Pedido confirmado', html, width:700, showCloseButton:true, showCancelButton:true, confirmButtonText:'Descargar factura', cancelButtonText:'Cerrar' })
    .then(res => {
      if (res.isConfirmed) {
        // generar PDF si jsPDF está disponible
        if (window.jspdf && window.jspdf.jsPDF) {
          const { jsPDF } = window.jspdf;
          try {
            const doc = new jsPDF({ unit: 'pt', format: 'a4' });
            let y = 40;
            doc.setFontSize(16);
            doc.text(`Factura N° ${venta.id}`, 40, y);
            y += 24;
            doc.setFontSize(12);
            doc.text(`Total: $${Number(venta.total).toLocaleString()}`, 40, y);
            y += 20;
            items.forEach(it => {
              const line = `${it.nombre} x${it.cantidad}  $${Number(it.precio || it.precio_unitario).toLocaleString()}  Sub: $${(Number(it.precio || it.precio_unitario) * Number(it.cantidad)).toLocaleString()}`;
              const split = doc.splitTextToSize(line, 500);
              doc.text(split, 40, y);
              y += 14 * (split.length);
              if (y > 750) { doc.addPage(); y = 40; }
            });
            doc.save(`factura_${venta.id}.pdf`);
          } catch (e) {
            console.error('Error generando PDF', e);
            const w = window.open('', '_blank'); w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Factura N° ${venta.id}</title></head><body>${html}</body></html>`); w.document.close();
          }
        } else {
          const w = window.open('', '_blank'); w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Factura N° ${venta.id}</title></head><body>${html}</body></html>`); w.document.close();
        }
      }
    });
}

async function checkout() {
  const items = getCart();
  if (!items.length) {
    Swal.fire({ icon: 'info', title: 'Carrito vacío', text: '¡Tu carrito está vacío!' });
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
      Swal.fire({ icon: 'error', title: 'Error', text: data.mensaje || "No se pudo confirmar el pedido" });
      return;
    }

  // Éxito: mostrar factura/venta (usar detalle del servidor si está disponible)
  mostrarFacturaModal(data.venta, data.venta.items || items);

    // Vacía carrito y repinta
    setCart([]);
    renderCart();

    // Aviso global (otras pestañas/páginas escuchan y repiden /productos)
    localStorage.setItem("lastCheckout", String(Date.now()));

  } catch (e) {
    console.error("checkout error", e);
    Swal.fire({ icon: 'error', title: 'Error', text: 'Error procesando el pedido. Intenta de nuevo.' });
  }
}

// deja visible para otros scripts si lo usas desde HTML
window.checkout = checkout;


