# web-csuazo
Sitio web www.elpuebloconsuazo.cl — candidatura de Christopher Suazo a la alcaldía de Coquimbo.

## Estructura
- `index.html` — página única con las secciones Noticias, Comunicaciones, Redes Sociales, Acerca de y Contacto.
- `css/estilos.css` — estilos (los colores están como variables al inicio del archivo).
- `js/app.js` — menú en teléfonos y filtros de la agenda.
- `img/` — fotografías (`candidato.jpg` en la portada, `portada-fondo.jpg` de fondo) e ilustraciones de ejemplo de las noticias (`noticia-*.svg`).

## Antes de publicar
1. En `index.html`, reemplazar los `href="#"` de las redes sociales por las direcciones reales.
2. Completar la reseña del candidato en "Acerca de".

## Agregar contenido
- **Noticia:** copiar un bloque `<article class="noticia">` y pegarlo al inicio de la lista.
- **Actividad:** copiar un `<li class="actividad">` y ajustar `data-tipo`
  (`reunion`, `movilizacion` o `aviso`).
- **Publicación de Instagram:** en la sección Redes Sociales, copiar un bloque
  `<article class="publicacion">` y cambiar la dirección de la publicación en los
  tres lugares donde aparece. La cuenta de Instagram debe ser pública.
