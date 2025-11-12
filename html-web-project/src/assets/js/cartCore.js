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

  // Exponer en window para compatibilidad con los scripts existentes
  window.cartCore = {
    API_URL,
    BACKEND_ORIGIN,
    getCart,
    setCart,
    getCartLS,
    setCartLS,
    fmt,
    normalizarImagen
  };

  // También atachar funciones sueltas (comodidad)
  window.getCart = getCart;
  window.setCart = setCart;
  window.getCartLS = getCartLS;
  window.setCartLS = setCartLS;
  window.fmt = fmt;
  window.normalizarImagen = normalizarImagen;
  window.BACKEND_ORIGIN = BACKEND_ORIGIN;
})();
