# AGENTS.md

Guía para agentes que trabajen en este repositorio. El detalle de cada sección está en
`README.md`; aquí va lo mínimo para no romper nada y **lo que queda pendiente**.

## Contexto rápido

Portafolio de un dibujante arquitectónico (Damián Peña). React 19 + Vite 8 (Rolldown) +
Tailwind CSS 4 + three.js. Gestor: **pnpm**.

```bash
pnpm dev      # desarrollo
pnpm build    # build a dist/
pnpm lint     # eslint
pnpm preview  # sirve el build
pnpm images   # regenera las imágenes web desde assets/originals/
```

Todo el contenido editable vive en `src/data/mockData.js`.

## Estado de las ramas

`main` es la rama de trabajo e **incluye ya el carrusel 3D**. La rama
`feature/carrusel-3d-proyectos` se mergeó con fast-forward y queda como referencia local.

---

# TO-DO

## 1. Bloqueantes antes de publicar

- [ ] **Sustituir los 6 proyectos de ejemplo.** Tienen `isTemplate: true` en
      `mockData.js` y se marcan con una etiqueta ámbar "Ejemplo" en el carrusel, la ficha
      y la grilla. Al reemplazarlos, borra `isTemplate`.
- [ ] **Datos reales del perfil.** En `mockData.js` siguen siendo placeholder:
      `education[0].institution` = `"Instituto Profesional"` y `experience[0].company` =
      `"Estudio Arquitectónico ABC"`. Un cliente los vería tal cual.
- [ ] **Conectar el formulario de contacto.** `src/pages/Contact.jsx` solo simula el
      envío con un `setTimeout`. Opciones sin backend: Formspree, Web3Forms, EmailJS.
- [ ] **Subir el CV en PDF** y definir `CV_URL` en
      `src/components/sections/CVDownload.jsx` (hoy es `null` y muestra un aviso).
- [ ] **SPA fallback en el hosting.** Todas las rutas deben servir `index.html`, o
      `/portfolio/3` dará 404 al recargar. En Netlify, `public/_redirects` con
      `/* /index.html 200`.
- [ ] **Cabeceras de caché.** Largas para `/assets/*` (llevan hash en el nombre), cortas
      para `index.html`.
- [ ] **Redes sociales vacías.** `professionalProfile.social.linkedin` e `.instagram`
      están en `""`, así que no se muestran. Rellenar o quitar del todo.

## 2. Contenido pendiente

- [ ] `specifications.area` de los proyectos (es opcional: si no está, no se muestra la
      fila, pero la ficha queda mejor con el dato).
- [ ] Imágenes de ejemplo de los servicios: `examples: []` en los tres. Antes apuntaban a
      archivos inexistentes.
- [ ] **Certificaciones hardcodeadas** en `WorkExperience.jsx` ("Título Profesional en
      Dibujo Arquitectónico", "Certificación AutoCAD"): deberían salir de `mockData.js`.
- [ ] **"Última actualización: Febrero 2026"** hardcodeado en `CVDownload.jsx`.
- [ ] **Horarios de atención y aviso de emergencias** hardcodeados en `ContactInfo.jsx`.
- [ ] Revisar que `priceRange` y `estimatedTimeframe` de los servicios sean reales.

## 3. Carrusel 3D

- [ ] **Desenfoque real de las piezas del fondo.** Hoy se atenúan con niebla de three.js
      (gratis). Un blur fotográfico de verdad necesita un pase de post-procesado
      (`@react-three/postprocessing` con `DepthOfField`): +60-100 KB gzip y coste de GPU
      por fotograma. Se decidió empezar por la niebla y valorar después.
- [ ] **Modelos reales.** Las 9 maquetas son genéricas por *tipo* de edificio, construidas
      con primitivas en `projectModels.jsx`. Cuando haya modelos propios, cargarlos como
      GLTF ahí (el registro `PROJECT_MODELS` es el único punto a tocar).
- [ ] **Ajustar el encuadre** si se quiere otro anillo: `RADIUS`, `RING_SQUASH` y
      `CAMERA_ELEVATION` en `carouselLayout.js` son los tres números que lo gobiernan.
- [ ] Valorar mostrar menos piezas a la vez si en algún momento se quiere la del frente
      más grande (hoy se ven las 9, por requisito explícito).

## 4. Sección "Del plano a la obra"

- [ ] **Sustituir la vivienda de ejemplo** por un proyecto real. Todo sale de
      `src/components/three/housePlan.js`.
- [ ] **Añadir aberturas de puertas y ventanas** partiendo los segmentos de `walls` en
      dos. Se dejó sin hacer a propósito: sin diseñar bien la circulación, un baño que se
      abre a la cocina es el tipo de error que un cliente profesional nota.

## 5. Infraestructura y calidad

- [ ] **No hay tests.** Durante el desarrollo se usaron scripts de Playwright + sharp
      (capturas headless, comparación de píxeles) que viven **fuera del repositorio** y se
      perderán. Si se quiere repetir esa verificación, hay que recrearlos.
- [ ] **Historial de git pesado.** Las imágenes originales (34 MB + 16 MB) siguen en
      commits antiguos aunque ya no estén en `public/`. Se limpia con `git filter-repo`.
- [ ] **`assets/originals/` está en `.gitignore`**: quien clone el repo no puede regenerar
      las imágenes con `pnpm images`. Valorar si guardar los originales fuera de git a
      propósito (documentado) o buscar otra vía.
- [ ] **Autoalojar Inter** en `public/fonts/` para quitar la dependencia de Google Fonts,
      o eliminarla y usar la fuente del sistema.
- [ ] **SEO.** Al ser una SPA sin prerender, el HTML inicial está vacío. Para un
      portafolio, un prerender (vite-plugin-ssr, react-snap o similar) mejoraría mucho.
- [ ] **Focus trap en el `Modal`.** Hoy bloquea el scroll y mueve el foco al abrir, pero
      el tabulador puede escaparse del diálogo.
- [ ] **Aviso `THREE.Clock is deprecated`** en consola: lo emite R3F/three r186, no
      nuestro código. Se resolverá al actualizar R3F.
- [ ] `pnpm <script>` verifica el lockfile antes de cada ejecución (~3 s). Se puede
      desactivar con `verifyDepsBeforeRun: false` en `pnpm-workspace.yaml`, pero es una
      protección de cadena de suministro: decidir con cuidado.

---

## Trampas que ya nos costaron tiempo

Estas son las que hay que respetar al tocar el código. Están explicadas en detalle en el
`README.md`, pero conviene tenerlas a mano:

1. **Tailwind v4 no lee `tailwind.config.js`.** El tema vive en `src/index.css`, en el
   bloque `@theme`. No crear un `tailwind.config.js`.
2. **Los estilos base van dentro de `@layer base`.** El CSS sin capa gana siempre a las
   utilidades de Tailwind.
3. **`carouselLayout.js` no debe importar three.js.** Lo usa la sección, y si importara
   three entraría en la carga inicial.
4. **El arrastre del carrusel no usa `setPointerCapture`.** Los escuchas van en `window`:
   con captura, el `click` se entrega al contenedor y el visor 3D no se entera de que han
   pulsado una pieza.
5. **`carouselTargets` devuelve coordenadas locales** al centro del anillo. La escena
   coloca el grupo en `(0, 0, -RING_DEPTH)`.
6. **Se interpola el ángulo, no la posición**, y con `shortestDelta`: si no, las piezas
   cortan por dentro del anillo o dan una vuelta de 320° en vez de 40°.
7. **Los props de transformación de R3F se reaplican** al cambiar de proyecto y pisarían
   la animación. Se pasan con valores iniciales fijos y todo lo mueve `useFrame`.
8. **three.js aplica un factor 1/π a la luz difusa.** Con intensidades "normales" la
   maqueta blanca sale gris; por eso son altas.
9. **No tocar el troceado de chunks sin verificar.** Al separar three.js en su propio
   chunk, React acabó dentro de él y la primera visita precargaba 1,15 MB. Comprobar
   siempre que `dist/index.html` no tenga un `modulepreload` de `three-*.js`.
10. **`OptimizedImage` con `src` ausente** devuelve el respaldo. No volver a llamar a
    `toWebp` sin comprobar el tipo: tumbaba la página entera.
