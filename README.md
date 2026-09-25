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
`[x1, z1, x2, z2]` en metros), `openings` (puertas y ventanas) y `rooms` (nombre,
superficie y posición de la etiqueta). El modelo 3D y el plano SVG se regeneran solos
a partir de esos datos.

Las aberturas se declaran en `openings` con `wall` (índice en `walls`), `from`/`to`
(coordenadas `[x, z]` de los extremos del hueco, siempre sobre la línea del muro),
`type` (`'door'` o `'window'`) y, en las puertas, `hinge` y `side` para el arco de
giro. `solidWallPieces()` y `openingsByWall()` parten los muros por esos huecos: el 3D
muestra el hueco con antepecho y vidrio en las ventanas, y el plano SVG dibuja el arco
de giro de las puertas y el eje del vidrio. Ambas vistas salen de los mismos datos, así
que los huecos siempre coinciden.

> Cuando tengas un proyecto real modelado, lo natural es sustituir esta vivienda de
> ejemplo por uno de tus proyectos y ajustar `openings` a su circulación real.

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

## El carrusel 3D de proyectos

En `/portfolio`, arriba de la grilla: un **anillo de maquetas 3D giratorias**, una por
proyecto, cada una con su **placa de título debajo**. La que está al frente sale con un
halo azul; las demás quedan atenuadas y giradas hacia atrás, perdiéndose en la distancia.
Debajo aparece la ficha del proyecto elegido.

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

### El anillo y la profundidad

Las piezas se reparten en una vuelta completa (`2π/n`), así que con 9 proyectos hay 40°
entre cada una. La pieza del frente queda en `z = 0` y el resto rodea hacia atrás.

Tres ajustes hacen que el fondo no compita con el frente:

- **Niebla de three.js**, enganchada a la distancia de cámara en cada fotograma. La pieza
  del frente queda limpia y las de atrás se atenúan hacia el color del fondo. Es el
  equivalente barato de un desenfoque: no cuesta ningún post-proceso.
- **La placa se desvanece** a partir de 50° y desaparece a 95°. Más allá la pieza mira
  hacia atrás y su placa se leería del revés.
- **El halo y la escala** solo los tiene la pieza que está al frente (ver más abajo).

El anillo es **circular**: se probó a comprimir su profundidad para acercar las piezas
traseras, pero el arrastre dejaba de recorrer un círculo y se notaba raro. Las piezas de
atrás se separan con la niebla y con la propia perspectiva.

La cámara mira al **centro del anillo**, no a la pieza del frente, y el fov es contenido
(32°) para que las piezas no se deformen.

### Encuadre por pantalla

Los números del encuadre viven en `CAROUSEL_LAYOUTS` (`carouselLayout.js`), con un preset
`mobile` y otro `desktop`: los mismos valores no sirven para un contenedor apaisado de
305 px y uno de móvil de 215 px (con el preset de escritorio, en móvil la cámara quedaba
tan lejos que las maquetas se veían a un tercio). La escena elige el preset por el ancho
del lienzo (768 px) y lo recalcula al redimensionar o girar el móvil, sin remontar nada.

Cada preset ajusta el radio del anillo, la elevación de cámara, el aire lateral, las
escalas de la pieza del frente y del resto, el levante y la atenuación. Las claves están
documentadas en `carouselLayout.js`.

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

- **Click en una maqueta** para seleccionarla. El carrusel se recoloca solo, con
  amortiguación exponencial, así que cualquier salto (incluso de 4 puestos) se ve como
  un giro suave. El clic elige la pieza más cercana a la dirección en que se pulsa, no
  la primera que toca el rayo: con la cámara baja las piezas se solapan.
- **Arrastrar** en horizontal (ratón o dedo). Un arrastre de 110 px = una pieza.
  Mientras arrastras, **la pieza que entraría al soltar crece, se ilumina y empieza a
  girar**: el traspaso es continuo, no hay que adivinar qué se va a seleccionar.
- **Flechas** laterales y **puntos** bajo el selector.
- **Teclado**: ← y → cuando el selector tiene el foco.
- Al pasar el ratón sobre una pieza, el cursor cambia a puntero.
- Con `prefers-reduced-motion` los cambios son instantáneos y **las maquetas no giran**.

### Cómo funciona el énfasis

No hay un estado de "seleccionada" por pieza. Cada una calcula su **énfasis** a partir de
su ángulo real (el de reposo más el giro del grupo): 1 cuando está en el frente, 0 cuando
está a una pieza o más. De ahí salen la escala, el halo, la atenuación y el giro.

Ese ángulo se **normaliza a (-π, π]** antes de medirlo (`shortestDelta`): el valor crudo
acumula vueltas —al arrastrar una vuelta completa o al cruzar por detrás del anillo al
cambiar de proyecto— y con 2π de más la pieza del frente se quedaba sin halo ni label.

Eso hace que el arrastre funcione solo: la pieza que va llegando al centro crece de forma
continua sin necesidad de estado de React por fotograma.

Y explica por qué al soltar no hay salto: el giro del grupo se asienta con **la misma
amortiguación** que usan las piezas para recolocarse. Como van a la par, la posición
resultante se mantiene continua. Si se reseteara de golpe (como estaba antes), el
carrusel daría un tirón de una pieza entera.

### Seis cosas que conviene no romper

1. **`carouselLayout.js` no debe importar three.js.** Lo usa también la sección, para
   saber cuánto hay que arrastrar por paso. Si importara three, la librería entraría en
   el bundle de la página y se perdería la carga diferida.
2. **El arrastre no usa `setPointerCapture`.** Los escuchas van en `window` a propósito:
   al capturar el puntero, el evento `click` se entrega al contenedor y el visor 3D nunca
   recibe el click sobre una pieza. Es el mismo fallo que ya hubo con las flechas y los
   puntos. Si alguna vez hace falta capturar el puntero, hay que resolver antes cómo
   llega el click al canvas.
3. **`carouselTargets` devuelve coordenadas locales** al centro de la circunferencia.
   La escena coloca el grupo giratorio en `(0, 0, -RADIUS)`. Restar ahí el radio lo
   restaba dos veces: las piezas quedaban 4,2 unidades más lejos y se veían la mitad
   de grandes. Costó encontrar porque el encuadre era correcto; el error estaba en la
   posición de las piezas.
4. **Se interpola el ÁNGULO, no la posición.** De él sale la posición de cada pieza. Con
   pasos de 40°, interpolar la posición directamente cortaría por dentro del anillo en vez
   de recorrer el arco. Además hay que resolver el salto de la pieza que sale por un
   extremo y reaparece por el otro (`shortestDelta`), o daría una vuelta de 320° en vez
   de 40°.
5. **Los props de transformación de R3F se reaplican.** Por eso `position`, `rotation-y` y
   `scale` se pasan con valores iniciales fijos y todo el movimiento lo hace `useFrame`:
   si cambiaran al cambiar de proyecto, R3F los reaplicaría y pisaría la animación.
6. **El clic de las piezas se resuelve por cercanía angular, no por el raycaster.** Con
   la cámara baja las piezas se solapan en pantalla y las cajas de clic de las del frente
   tapan a las de atrás: pulsar una pieza del fondo seleccionaba a su vecina y parecía
   que "solo funcionaban las primeras". `handlePieceClick` compara el ángulo de cada
   pieza con el rayo pulsado y se queda con el menor. Volver al raycaster reintroduce el
   bug.

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
