/* =========================================================
   Interacciones del sitio: menú móvil, sección activa,
   y filtros de la agenda.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Menú en teléfonos ---------- */
  var boton = document.querySelector(".menu-boton");
  var menu = document.getElementById("menu");
  var textoBoton = boton.querySelector(".solo-lectores");

  function cerrarMenu() {
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
    textoBoton.textContent = "Abrir menú";
  }

  boton.addEventListener("click", function () {
    var abierto = menu.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", String(abierto));
    textoBoton.textContent = abierto ? "Cerrar menú" : "Abrir menú";
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) cerrarMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("abierto")) {
      cerrarMenu();
      boton.focus();
    }
  });

  /* ---------- Marcar en el menú la sección visible ---------- */
  var enlaces = menu.querySelectorAll("a[href^='#']");
  if ("IntersectionObserver" in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        enlaces.forEach(function (a) {
          var coincide = a.getAttribute("href") === "#" + entrada.target.id;
          a.classList.toggle("activo", coincide && !a.classList.contains("menu__destacado"));
          if (coincide) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    ["noticias", "comunicaciones", "redes", "acerca", "contacto"].forEach(function (id) {
      var seccion = document.getElementById(id);
      if (seccion) observador.observe(seccion);
    });
  }

  /* ---------- Filtros de la agenda ---------- */
  var filtros = document.querySelectorAll(".filtro");
  var actividades = document.querySelectorAll(".actividad");
  var mensajeVacio = document.querySelector(".agenda__vacia");

  filtros.forEach(function (filtro) {
    filtro.addEventListener("click", function () {
      var tipo = filtro.dataset.filtro;
      var visibles = 0;

      filtros.forEach(function (f) {
        var activo = f === filtro;
        f.classList.toggle("activo", activo);
        f.setAttribute("aria-pressed", String(activo));
      });

      actividades.forEach(function (act) {
        var mostrar = tipo === "todos" || act.dataset.tipo === tipo;
        act.hidden = !mostrar;
        if (mostrar) visibles++;
      });

      mensajeVacio.hidden = visibles > 0;
    });
  });

  /* ---------- Año actual en el pie ---------- */
  document.getElementById("anio").textContent = new Date().getFullYear();
})();
