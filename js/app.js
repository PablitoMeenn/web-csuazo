/* =========================================================
   Interacciones del sitio: menú móvil, sección activa,
   filtros de la agenda y envío del formulario de contacto.
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

    ["noticias", "comunicaciones", "acerca", "contacto"].forEach(function (id) {
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

  /* ---------- Formulario de contacto ---------- */
  var formulario = document.getElementById("formulario-contacto");
  var estado = formulario.querySelector(".formulario__estado");
  var botonEnviar = formulario.querySelector("button[type='submit']");

  var reglas = {
    nombre: function (v) { return v.trim().length >= 2 ? "" : "Escribe tu nombre."; },
    correo: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Escribe un correo electrónico válido.";
    },
    mensaje: function (v) { return v.trim().length >= 10 ? "" : "El mensaje debe tener al menos 10 caracteres."; }
  };

  function validarCampo(nombre) {
    var campo = formulario.elements[nombre];
    var error = reglas[nombre](campo.value);
    document.getElementById("error-" + nombre).textContent = error;
    campo.setAttribute("aria-invalid", error ? "true" : "false");
    if (error) campo.setAttribute("aria-describedby", "error-" + nombre);
    else campo.removeAttribute("aria-describedby");
    return !error;
  }

  Object.keys(reglas).forEach(function (nombre) {
    formulario.elements[nombre].addEventListener("blur", function () { validarCampo(nombre); });
  });

  function mostrarEstado(texto, tipo) {
    estado.textContent = texto;
    estado.className = "formulario__estado " + (tipo || "");
  }

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    var primeroInvalido = null;
    Object.keys(reglas).forEach(function (nombre) {
      if (!validarCampo(nombre) && !primeroInvalido) primeroInvalido = formulario.elements[nombre];
    });
    if (primeroInvalido) {
      mostrarEstado("Revisa los campos marcados.", "error");
      primeroInvalido.focus();
      return;
    }

    botonEnviar.disabled = true;
    botonEnviar.textContent = "Enviando…";
    mostrarEstado("");

    fetch(formulario.action, {
      method: "POST",
      body: new FormData(formulario),
      headers: { "Accept": "application/json" }
    })
      .then(function (r) {
        return r.json().catch(function () { return { ok: false }; }).then(function (datos) {
          if (!r.ok || !datos.ok) throw new Error(datos.mensaje || "Error de envío");
          return datos;
        });
      })
      .then(function () {
        formulario.reset();
        mostrarEstado("¡Gracias! Recibimos tu mensaje y te responderemos pronto.", "ok");
      })
      .catch(function (err) {
        mostrarEstado(
          (err && err.message && err.message !== "Failed to fetch" && err.message !== "Error de envío")
            ? err.message
            : "No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos a contacto@elpuebloconsuazo.cl.",
          "error"
        );
      })
      .finally(function () {
        botonEnviar.disabled = false;
        botonEnviar.textContent = "Enviar mensaje";
      });
  });

  /* ---------- Año actual en el pie ---------- */
  document.getElementById("anio").textContent = new Date().getFullYear();
})();
