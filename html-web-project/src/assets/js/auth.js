// src/assets/js/auth.js
(function () {
  console.log("[auth] cargado");

  // --- utilidades ---
  function getUser() {
    try { return JSON.parse(localStorage.getItem("usuario") || "null"); }
    catch { return null; }
  }

  function srcRoot() {
    // Ej.: /html-web-project/src/index.html -> /html-web-project/src
    const m = location.pathname.match(/^(.*\/src)\//);
    return m ? m[1] : "";
  }

  function logout() {
    localStorage.removeItem("usuario");
    const root = srcRoot();

    if (root) {
      // Redirige a "<prefijo>/user/login.html"
      location.href = `${root}/user/login.html`;
    } else {
      // Fallback por si no estás bajo /src
      const here = location.pathname;
      location.href = here.replace(/\/[^\/]*$/, "/user/login.html");
    }
  }

  // --- UI: nav superior ---
  function renderNav() {
    const u = getUser();
    const saludo     = document.getElementById("saludo");
    const linkLogin  = document.getElementById("link-login");
    const linkReg    = document.getElementById("link-reg");
    const linkLogout = document.getElementById("link-logout");

    if (u && u.nombre) {
      if (saludo) saludo.textContent = `Hola, ${u.nombre}`;
      if (linkLogin) linkLogin.style.display = "none";
      if (linkReg) linkReg.style.display = "none";
      if (linkLogout) linkLogout.style.display = "inline";
    } else {
      if (saludo) saludo.textContent = "";
      if (linkLogin) linkLogin.style.display = "inline";
      if (linkReg) linkReg.style.display = "inline";
      if (linkLogout) linkLogout.style.display = "none";
    }
    if (linkLogout) linkLogout.onclick = (e) => { e.preventDefault(); logout(); };
  }
  

  // --- UI: recuadro de sesión en inicio ---
  function renderUserBox() {
    const box = document.getElementById("user-box");
    if (!box) return;
    const u = getUser();

    if (!u) { box.hidden = true; box.innerHTML = ""; return; }

    box.hidden = false;
    box.innerHTML = `
      <div><b>Sesión iniciada:</b> ${u.nombre} <span style="color:#6b7280">(${u.correo})</span></div>
      <div class="actions" style="margin-top:8px;display:flex;gap:10px;flex-wrap:wrap">
        <button id="btn-mi-cuenta" style="background:#2563eb;color:#fff;border:0;padding:8px 12px;border-radius:6px;cursor:pointer;font-weight:700">Mi cuenta</button>
        <button id="btn-logout" style="background:#e53935;color:#fff;border:0;padding:8px 12px;border-radius:6px;cursor:pointer;font-weight:700">Cerrar sesión</button>
      </div>
    `;
    const btnOut = document.getElementById("btn-logout");
    if (btnOut) btnOut.onclick = logout;
    const btnCuenta = document.getElementById("btn-mi-cuenta");
    if (btnCuenta) btnCuenta.onclick = () => {
      alert(`Cliente: ${u.nombre}\nCorreo: ${u.correo}\nID: ${u.id}`);
    };
  }

  function boot() {
    renderNav();
    renderUserBox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // export opcional para debug
  window.__auth = { getUser, logout, renderNav, renderUserBox };
})();
