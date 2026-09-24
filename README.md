# Modelados DP — Portafolio de Damián Peña

Sitio de portafolio para dibujo arquitectónico.
React 19.3 + Vite 8 (Rolldown) + Tailwind CSS 4.3 + three.js.

Se usa **pnpm** (gestor de paquetes del proyecto, fijado en `packageManager`).

```bash
pnpm install
pnpm dev      # servidor de desarrollo
pnpm build    # build de producción en dist/
pnpm preview  # sirve el build de producción
pnpm lint     # eslint
pnpm images   # regenera las imágenes web desde los originales
```

> Si no tienes pnpm: `corepack enable pnpm` (viene incluido con Node).
> La versión exacta está en el campo `packageManager` de `package.json`.

## Imágenes

Las fotos originales viven en `assets/originals/` y **no van al repositorio** (una de
ellas pesaba 34 MB). Lo que se publica se genera con:

```bash
pnpm images
```

Eso produce en `public/`, por cada original, dos archivos:

| Archivo | Para qué |
|---|---|
| `nombre.webp` | Formato que usa el navegador en el 99% de los casos |
| `nombre.jpg` | Respaldo para navegadores antiguos |

El componente `OptimizedImage` genera el `<picture>` con ambos y elige
automáticamente. En el código se escribe la ruta del `.jpg` y el WebP se deduce solo.

### Agregar una foto nueva

1. Copia el original a `assets/originals/` (por ejemplo `casa-los-andes.jpg`).
2. Añádela a la lista `IMAGES` en `scripts/optimize-images.mjs` con su ancho y calidad.
3. Ejecuta `pnpm images`.
4. Referénciala desde `src/data/mockData.js` como `/casa-los-andes.jpg`.

El script nunca agranda imágenes y siempre parte del original, así que puedes
ejecutarlo las veces que quieras sin perder calidad.

## Estructura

```
assets/originals/        Fotos originales (ignoradas por git)
public/                  Assets generados que se publican
scripts/
  optimize-images.mjs    Pipeline de imágenes (sharp)
src/
  components/
    common/              Button, Card, Modal, OptimizedImage, ImagePlaceholder,
                         ServiceIcon, ErrorBoundary, LoadingSpinner
    layout/              Navigation, Footer, Layout, Header
    sections/            Secciones de página
    three/               Visores 3D (maqueta "plano a la obra" y carrusel)
  data/mockData.js       Todo el contenido editable (perfil, proyectos, servicios)
  hooks/                 useReducedMotion
  pages/                 Una por ruta, cargadas con lazy()
  utils/                 Constantes y helpers
```

Todo el contenido está en `src/data/mockData.js`: perfil, redes sociales, proyectos
y servicios. Para editar textos o precios, ese es el único archivo que hay que tocar.

## Tailwind CSS v4

**La configuración del tema vive en `src/index.css`, dentro del bloque `@theme`.**
No hay `tailwind.config.js` y no debe haberlo: Tailwind v4 no lee ese archivo salvo
que se importe explícitamente con `@config`, así que tenerlo ahí hacía que las clases
`primary-*`, `accent-*` y `surface-*` no generaran ningún CSS.

Los estilos base también van dentro de `@layer base`. Es importante: el CSS que no
está en una capa gana siempre a las utilidades de Tailwind, así que reglas sueltas
como `h1 { font-weight: 600 }` anulan `font-bold`, `text-white` o `leading-tight`.

## La sección 3D ("Del plano a la obra")

En la home, el plano técnico se traza solo, los muros se levantan y el resultado es
una maqueta 3D que el visitante puede girar arrastrando. Está pensada como
demostración directa del trabajo: de plano a construcción.

```
src/components/three/
  housePlan.js      Datos del plano (muros, recintos, tiempos). Fuente única de verdad.
  PlanSvg.jsx       El mismo plano en SVG: se ve mientras carga el 3D y sirve de
                    respaldo si el dispositivo no soporta WebGL.
  BuildingScene.jsx El visor: cámara, luces, animación y controles.
src/components/sections/PlanToBuilding.jsx   La sección (textos + proceso).
```

### Cambiar la casa de ejemplo

Todo sale de `housePlan.js`. Para cambiar la distribución, edita `walls` (segmentos
`[x1, z1, x2, z2]` en metros) y `rooms` (nombre, superficie y posición de la etiqueta).
El modelo 3D y el plano SVG se regeneran solos a partir de esos datos.

> Cuando tengas un proyecto real modelado, lo natural es sustituir esta vivienda de
> ejemplo por uno de tus proyectos. También se le pueden añadir aberturas de puertas
> y ventanas partiendo los segmentos de `walls` en dos.

### Decisiones de rendimiento

- **El visor no pesa en la primera visita.** `BuildingScene` se carga con `import()`
  dinámico y solo se descarga cuando la sección entra en pantalla. Verificado: la
  carga inicial no pide el chunk de three.js.
- **Cuando la sección sale de pantalla, deja de renderizar** (`frameloop: 'never'`).
- **No secuestra el scroll:** la rueda del ratón y el arrastre vertical en móvil
  siguen desplazando la página (`touch-action: pan-y pinch-zoom` en `index.css`).
  Solo el gesto horizontal gira el modelo.
- **Respeta "reducir movimiento":** muestra el resultado final sin animar ni rotar.
- **Si no hay WebGL**, o el chunk falla, se muestra el plano en SVG vía
  `ErrorBoundary`, sin dejar la página en blanco.
- **Si tocas el troceado de chunks** (`vite.config.js`), comprueba siempre que
  `dist/index.html` no tenga un `<link rel="modulepreload" href=".../three-....js">`.
  Ya pasó una vez: al separar three.js en su propio chunk, React acabó dentro de
  él, la entrada lo importaba de forma estática y el navegador **precargaba 1,15 MB**
  en la primera visita. Por eso la configuración se dejó simple (ver los comentarios
  de `vite.config.js`).

### Iluminación

Las intensidades de luz (`Lights` en `BuildingScene.jsx`) son altas a propósito:
three.js aplica un factor **1/π** a la luz difusa, así que con valores "normales"
(1-2) la maqueta blanca se ve gris. Si cambias de `flat` a tone mapping ACES, hay que
reajustarlas.

## El carrusel 3D de proyectos (rama experimental)

> Esta sección vive en la rama `feature/carrusel-3d-proyectos`. No está en `main`.

En `/portfolio`, arriba de la grilla: una fila curva de **maquetas 3D giratorias**, una
por proyecto, cada una con su **placa de título debajo**. La seleccionada sale al frente
con un halo azul; las demás quedan atenuadas, más pequeñas y giradas hacia atrás. Debajo
aparece la ficha del proyecto elegido.

La mecánica está inspirada en el selector de personajes de *The Binding of Isaac*
(todos los elementos a la vista, uno destacado, flechas a los lados), pero con el lenguaje
visual del sitio: las maquetas son volúmenes blancos con las aristas en azul, igual que la
sección "Del plano a la obra".

```
src/components/three/
  carouselLayout.js           Geometría del carrusel (sin three.js, ver abajo)
  projectModels.jsx           Las maquetas, hechas con primitivas de three.js
  projectIcons.js             Placas de título + iconos del respaldo sin WebGL
  ProjectCarouselScene.jsx    El visor 3D
src/components/sections/ProjectCarousel.jsx   La sección (selector + ficha + flechas)
```

### Las maquetas

Cada proyecto elige la suya con su campo `model`:

| Clave | Forma |
|---|---|
| `winery` | Naves abovedadas con un anexo |
| `basilica` | Nave central, dos torres con aguja y escalinata |
| `church` | Nave con una torre |
| `house` | Volumen con techumbre a dos aguas y cuerpo adosado |
| `tower` | Tres volúmenes escalonados con fajas de ventanas |
| `warehouse` | Nave larga con lucernario y chimenea |
| `pavilion` | Losa de cubierta sobre pilares |
| `housing` | Tres casas de cubierta plana alrededor de un patio |
| `lookout` | Cuerpo cilíndrico con balcones y mástil |

Todas giran sobre su eje (0,42 rad/s) con un desfase distinto para que no vayan a la vez.
Para añadir una maqueta nueva: escribe el componente en `projectModels.jsx`, añádelo al
registro `PROJECT_MODELS` y asígnale la clave a un proyecto.

### Proyectos de ejemplo

El carrusel viene con los 3 proyectos reales más **6 de ejemplo** (`isTemplate: true`) para
poder probarlo con 9 elementos. Se marcan con una etiqueta ámbar "Ejemplo" en el carrusel,
en la ficha y en la grilla, y no aparecen en "Proyectos Destacados" de la home porque
tienen `featured: false`.

> **Antes de publicar, sustitúyelos por proyectos tuyos** y borra `isTemplate`. La marca
> está ahí precisamente para que no se confundan con trabajo real.

### Interacción

- **Arrastrar** en horizontal (ratón o dedo). Un arrastre de 110 px = una pieza.
- **Flechas** laterales y **puntos** bajo el selector.
- **Teclado**: ← y → cuando el selector tiene el foco.
- Con `prefers-reduced-motion` los cambios son instantáneos y **las maquetas no giran**.

### Tres cosas que conviene no romper

1. **`carouselLayout.js` no debe importar three.js.** Lo usa también la sección, para
   saber cuánto hay que arrastrar por paso. Si importara three, la librería entraría en
   el bundle de la página y se perdería la carga diferida.
2. **`carouselTargets` devuelve coordenadas locales** al centro de la circunferencia.
   La escena coloca el grupo giratorio en `(0, 0, -RADIUS)`. Restar ahí el radio lo
   restaba dos veces: las piezas quedaban 4,2 unidades más lejos y se veían la mitad
   de grandes. Costó encontrar porque el encuadre era correcto; el error estaba en la
   posición de las piezas.
3. **El radio es grande (7,5) a propósito.** Con 9 elementos, un radio pequeño curvaba
   tanto el abanico que las piezas de los extremos quedaban muy atrás —diminutas— y sus
   placas casi de canto. Un radio grande deja un arco suave: todas a una profundidad
   parecida, como en el selector de Isaac. Si añades muchos más proyectos, sube el radio
   o el abanico se cerrará hasta solaparse.

### Sin WebGL

Si el navegador no puede crear el contexto 3D, se muestran los iconos de cada categoría
como imágenes (`toDataURL` del mismo lienzo que usaba la versión anterior) en una fila.
El selector y la ficha siguen funcionando igual.

## Rutas

| Ruta | Página |
|---|---|
| `/` | Home |
| `/portfolio` | Portafolio |
| `/portfolio/:projectId` | Portafolio con el detalle abierto |
| `/services` | Servicios |
| `/services#<id>` | Servicios con el detalle abierto |
| `/about` | Acerca de |
| `/contact` | Contacto |
| cualquier otra | 404 |

Al desplegar, el servidor debe redirigir todas las rutas a `index.html` (SPA
fallback). En Netlify basta un archivo `public/_redirects` con `/* /index.html 200`;
en Vercel se configura con rewrites.

## Pendientes conocidos

- **La casa del 3D es un ejemplo**, no un proyecto real. Sustituirla por uno tuyo
  (ver arriba) es la mejora que más valor añade.
- **Los 6 proyectos de ejemplo del carrusel** (`isTemplate: true` en `mockData.js`) hay
  que sustituirlos por proyectos reales antes de publicar. Se marcan con una etiqueta
  "Ejemplo" justamente para que no pasen desapercibidos.
- **Las maquetas son genéricas.** Cada proyecto usa una forma asociada a su tipo, no un
  modelo de su edificio real. Cuando tengas modelos propios, se pueden cargar como GLTF
  en `projectModels.jsx` en vez de construirlos con primitivas.
- **Formulario de contacto**: `src/pages/Contact.jsx` solo simula el envío. Hay que
  conectarlo a un servicio real (Formspree, Web3Forms, EmailJS o un backend propio).
- **CV en PDF**: en `src/components/sections/CVDownload.jsx`, define `CV_URL` con la
  ruta del PDF para que el botón descargue de verdad.
- **Áreas de los proyectos**: `specifications.area` es opcional. Si no está, no se
  muestra la fila, pero queda mejor con el dato real.
- **Servicios de ejemplo**: `examples` está vacío a propósito; antes apuntaba a
  archivos inexistentes.
- **Inter**: se carga desde Google Fonts. Si prefieres cero dependencias externas,
  se puede autoalojar en `public/fonts/`, o quitarlo y usar la fuente del sistema.
- **Historial de git**: las imágenes gigantes siguen en commits anteriores. Si el
  peso del repositorio importa, se puede limpiar con `git filter-repo`.
- **Caché del servidor**: conviene configurar cabeceras largas para `/assets/*`
  (que llevan hash en el nombre) y cortas para `index.html`.
- **`pnpm-workspace.yaml`**: no es un monorepo, solo guarda la configuración de pnpm.
  pnpm 12 exige una antigüedad mínima a las dependencias recién publicadas; ese
  archivo registra las dos excepciones que se pidieron a propósito (three y vite).
