# web-csuazo
Sitio web www.elpuebloconsuazo.cl — candidatura de Christopher Suazo a la alcaldía de Coquimbo.

## Estructura
- `index.html` — página única con las secciones Noticias, Comunicaciones, Acerca de y Contacto.
- `css/estilos.css` — estilos (los colores están como variables al inicio del archivo).
- `js/app.js` — menú en teléfonos, filtros de la agenda y envío del formulario.
- `enviar.php` — envía por correo los mensajes del formulario (requiere PHP, incluido en cPanel).
- `img/` — imágenes de ejemplo; reemplazar por fotos reales.

## Antes de publicar
1. En `enviar.php`, cambiar `DESTINO` (casilla que recibe los mensajes) y `REMITENTE`
   (casilla creada en cPanel con el mismo dominio).
2. En `index.html`, reemplazar los `href="#"` de las redes sociales por las direcciones reales.
3. Cambiar `img/candidato.svg` por la foto del candidato y completar la reseña en "Acerca de".
4. Quitar el aviso amarillo "Sitio en construcción" (bloque `aviso-ejemplo` en `index.html`).

## Agregar contenido
- **Noticia:** copiar un bloque `<article class="noticia">` y pegarlo al inicio de la lista.
- **Actividad:** copiar un `<li class="actividad">` y ajustar `data-tipo`
  (`reunion`, `movilizacion` o `aviso`).
