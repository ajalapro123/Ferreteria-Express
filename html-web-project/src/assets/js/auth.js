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
    const linkProfile= document.getElementById("link-profile");

    if (u && u.nombre) {
      if (saludo) saludo.textContent = `Hola, ${u.nombre}`;
      if (linkLogin) linkLogin.style.display = "none";
      if (linkReg) linkReg.style.display = "none";
      if (linkLogout) linkLogout.style.display = "inline";
      if (linkProfile) {
        linkProfile.style.display = "inline";
        const root = srcRoot();
        linkProfile.href = root ? `${root}/user/profile.html` : './user/profile.html';
      }
    } else {
      if (saludo) saludo.textContent = "";
      if (linkLogin) linkLogin.style.display = "inline";
      if (linkReg) linkReg.style.display = "inline";
      if (linkLogout) linkLogout.style.display = "none";
      if (linkProfile) linkProfile.style.display = "none";
    }
    if (linkLogout) linkLogout.onclick = (e) => { e.preventDefault(); logout(); };
  }
  

  // --- UI: recuadro de sesión en inicio ---
  function renderUserBox() {
    const box = document.getElementById("user-box");
    if (!box) return;
    const u = getUser();

    if (!u) { box.hidden = true; box.innerHTML = ""; return; }

    // Ya no mostramos el recuadro plano; se usa modal profesional.
    box.hidden = true; // lo dejamos oculto para mantener compatibilidad
    box.innerHTML = "";

    // Mostrar modal sólo una vez por sesión/navegación.
    if (typeof Swal !== 'undefined' && !sessionStorage.getItem('welcomeShown')) {
      sessionStorage.setItem('welcomeShown', '1');
      Swal.fire({
        title: `Bienvenido, ${u.nombre}`,
        icon: 'success',
        html: `
          <div style="text-align:left;font-size:15px;line-height:1.4">
            <p><strong>Correo:</strong> <span style="color:#374151">${u.correo}</span></p>
            <p><strong>ID usuario:</strong> ${u.id}</p>
            <p style="margin-top:12px">Selecciona una opción para continuar.</p>
          </div>
        `,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Mi perfil',
        denyButtonText: 'Cerrar sesión',
        cancelButtonText: 'Seguir navegando',
        confirmButtonColor: '#2563eb',
        denyButtonColor: '#e53935',
        cancelButtonColor: '#6b7280',
        backdrop: true,
        allowOutsideClick: true,
      }).then(res => {
        if (res.isConfirmed) {
          // Navegamos al perfil (ajusta si tu ruta es distinta)
          const root = srcRoot();
          const profilePath = root ? `${root}/user/profile.html` : './user/profile.html';
          location.href = profilePath;
        } else if (res.isDenied) {
          logout();
        }
      });
    }
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
