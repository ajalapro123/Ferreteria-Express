// cartCore.js - helpers compartidos para el carrito
(function(){
  const API_URL = "https://ferreteriaexpress.shop/api";
  const BACKEND_ORIGIN = (()=>{ try { return new URL(API_URL).origin; } catch { return "https://ferreteriaexpress.shop"; } })();

  function getCart(){
    const a = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(a) && a.length) return a;
    const b = JSON.parse(localStorage.getItem("carrito") || "[]");
    return Array.isArray(b) ? b : [];
  }

  function setCart(v){
    localStorage.setItem("cart", JSON.stringify(v));
    localStorage.setItem("carrito", JSON.stringify(v));
  }

  function getCartLS(){
    return JSON.parse(localStorage.getItem("carrito") || "[]");
  }
  function setCartLS(v){
    localStorage.setItem("carrito", JSON.stringify(v));
    localStorage.setItem("cart", JSON.stringify(v));
  }

  function fmt(n){ return Number(n||0).toLocaleString("es-CO"); }

  function normalizarImagen(raw){
    if (!raw) return "";
    const s = String(raw);
    if (/^https?:\/\//i.test(s)) return s;
    if (s.startsWith("/")) return BACKEND_ORIGIN + s;
    const clean = s.replace(/^\/+/, "");
    return `${BACKEND_ORIGIN}/assets/img/productos/${clean}`;
  }

  // ====== Factura (modal + PDF) unificada ======
  function mostrarFacturaModal(venta, items) {
    const cliente = venta?.cliente || JSON.parse(localStorage.getItem('usuario')||'null') || {};
    const nombreCliente = cliente?.nombre || 'Consumidor final';
    const correoCliente = cliente?.correo || '';
    const metodoPago = venta?.metodoPago || 'Efectivo';
    const fecha = venta?.fecha ? new Date(venta.fecha) : new Date();

    const rows = (items||[]).map(i => {
      const precio = Number(i.precio || i.precio_unitario);
      const cant = Number(i.cantidad);
      return `<tr>
        <td>${i.nombre}</td>
        <td style="text-align:center">${cant}</td>
        <td style="text-align:right">$${(precio).toLocaleString()}</td>
        <td style="text-align:right">$${(precio*cant).toLocaleString()}</td>
      </tr>`;}).join('');

    const html = `
      <div style="text-align:left;font-family:Arial,sans-serif">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div>
            <div style="font-size:20px;font-weight:700">Ferretería Express</div>
            <div style="color:#555">NIT 900.000.000-1</div>
            <div style="color:#555">https://ferreteriaexpress.shop</div>
          </div>
          <div style="text-align:right">
            <div><b>Factura N°</b> ${venta?.id ?? '-'}</div>
            <div><b>Fecha:</b> ${fecha.toLocaleString()}</div>
          </div>
        </div>

        <div style="background:#f7f7f7;border:1px solid #eee;padding:10px;border-radius:8px;margin-bottom:12px">
          <div><b>Cliente:</b> ${nombreCliente}</div>
          ${correoCliente ? `<div><b>Correo:</b> ${correoCliente}</div>` : ''}
          <div><b>Método de pago:</b> ${metodoPago}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          <thead>
            <tr>
              <th style="border-bottom:2px solid #ddd;text-align:left;padding:6px 4px">Producto</th>
              <th style="border-bottom:2px solid #ddd;text-align:center;padding:6px 4px">Cant.</th>
              <th style="border-bottom:2px solid #ddd;text-align:right;padding:6px 4px">Precio</th>
              <th style="border-bottom:2px solid #ddd;text-align:right;padding:6px 4px">Subtotal</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align:right;padding:8px 4px"><b>Total</b></td>
              <td style="text-align:right;padding:8px 4px"><b>$${Number(venta?.total||0).toLocaleString()}</b></td>
            </tr>
          </tfoot>
        </table>
      </div>`;

    // SweetAlert2 debe estar cargado
    if (!window.Swal) { alert('Pedido confirmado. Total: $'+Number(venta?.total||0).toLocaleString()); return; }

    Swal.fire({ title: 'Pedido confirmado', html, width:760, showCloseButton:true, showCancelButton:true, confirmButtonText:'Descargar factura', cancelButtonText:'Cerrar' })
      .then(res => {
        if (res.isConfirmed) {
          if (window.jspdf && window.jspdf.jsPDF) {
            const { jsPDF } = window.jspdf;
            try {
              const doc = new jsPDF({ unit: 'pt', format: 'a4' });
              let y = 40;
              doc.setFontSize(18);
              doc.text('Ferretería Express', 40, y); y += 18;
              doc.setFontSize(10);
              doc.text('NIT 900.000.000-1', 40, y); y += 14;
              doc.text('https://ferreteriaexpress.shop', 40, y); y += 20;
              doc.setFontSize(14);
              doc.text(`Factura N° ${venta?.id ?? '-'}`, 40, y);
              doc.text(`Fecha: ${fecha.toLocaleString()}`, 300, y);
              y += 24;
              doc.setFontSize(12);
              doc.text(`Cliente: ${nombreCliente}`, 40, y); y += 14;
              if (correoCliente) { doc.text(`Correo: ${correoCliente}`, 40, y); y += 14; }
              doc.text(`Método de pago: ${metodoPago}`, 40, y); y += 18;
              const colX = [40, 360, 430, 500];
              doc.setFontSize(11);
              doc.text('Producto', colX[0], y);
              doc.text('Cant.', colX[1], y);
              doc.text('Precio', colX[2], y);
              doc.text('Subtotal', colX[3], y);
              y += 8; doc.line(40, y, 550, y); y += 12;
              (items||[]).forEach(it => {
                const precio = Number(it.precio || it.precio_unitario || 0);
                const cant = Number(it.cantidad || 0);
                doc.text(String(it.nombre), colX[0], y);
                doc.text(String(cant), colX[1], y, { align: 'right' });
                doc.text(`$${precio.toLocaleString()}`, colX[2], y, { align: 'right' });
                doc.text(`$${(precio*cant).toLocaleString()}`, colX[3], y, { align: 'right' });
                y += 16;
              });
              y += 6; doc.line(40, y, 550, y); y += 18;
              doc.setFontSize(12);
              doc.text('Total:', 460, y);
              doc.text(`$${Number(venta?.total||0).toLocaleString()}`, 550, y, { align: 'right' });
              y += 30;
              doc.setFontSize(10); doc.text('Gracias por su compra.', 40, y);
              doc.save(`factura_${venta?.id ?? 'venta'}.pdf`);
            } catch (e) {
              const w = window.open('', '_blank'); w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Factura</title></head><body>${html}</body></html>`); w.document.close();
            }
          } else {
            const w = window.open('', '_blank'); w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Factura</title></head><body>${html}</body></html>`); w.document.close();
          }
        }
      });
  }

  // Exponer en window para compatibilidad con los scripts existentes
  window.cartCore = {
    API_URL,
    BACKEND_ORIGIN,
    getCart,
    setCart,
    getCartLS,
    setCartLS,
    fmt,
    normalizarImagen,
    mostrarFacturaModal
  };

  // También atachar funciones sueltas (comodidad)
  window.getCart = getCart;
  window.setCart = setCart;
  window.getCartLS = getCartLS;
  window.setCartLS = setCartLS;
  window.fmt = fmt;
  window.normalizarImagen = normalizarImagen;
  window.BACKEND_ORIGIN = BACKEND_ORIGIN;
  // Exponer también API_URL para compatibilidad con scripts antiguos
  if (!window.API_URL) window.API_URL = API_URL;
  window.mostrarFacturaModal = mostrarFacturaModal;
})();
