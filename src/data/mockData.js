// Mock data for development and testing

export const professionalProfile = {
  personalInfo: {
    fullName: "Damián Peña",
    title: "Dibujante Arquitectónico Titulado",
    photo: "/damian.jpg",
    email: "damiancpg@gmail.com",
    phone: "+56 9 3223 3332",
    location: "Maipú, Chile",
    summary: "Dibujante arquitectónico con experiencia en proyectos residenciales y comerciales, especializado en planos técnicos y visualización arquitectónica."
  },
  /**
   * Redes sociales. Deja la cadena vacía en las que no uses: los enlaces vacíos
   * simplemente no se muestran (antes había enlaces href="#" que no llevaban a nada).
   */
  social: {
    linkedin: "",
    instagram: ""
  },
  education: [
    {
      institution: "Instituto Profesional",
      degree: "Título Profesional",
      field: "Dibujo Arquitectónico",
      startYear: 2018,
      endYear: 2021,
      description: "Formación integral en dibujo técnico, normativas de construcción y software especializado."
    }
  ],
  experience: [
    {
      company: "Estudio Arquitectónico ABC",
      position: "Dibujante Arquitectónico",
      startDate: "2021-03",
      endDate: "Presente",
      description: "Desarrollo de planos técnicos para proyectos residenciales y comerciales.",
      achievements: [
        "Participación en más de 50 proyectos arquitectónicos",
        "Especialización en normativas de construcción chilenas",
        "Manejo avanzado de AutoCAD y Revit"
      ]
    }
  ],
  skills: [
    { name: "AutoCAD", level: "Avanzado" },
    { name: "Revit", level: "Intermedio" },
    { name: "SketchUp", level: "Intermedio" },
    { name: "Normativas de Construcción", level: "Avanzado" },
    { name: "Dibujo Técnico", level: "Experto" }
  ]
};

/**
 * Proyectos del portafolio.
 *
 * `category` debe ser una de las claves de PROJECT_CATEGORIES (utils/constants.js):
 * residential | commercial | patrimonial | industrial | renovation.
 *
 * `model` elige la maqueta 3D del carrusel. Claves disponibles en
 * src/components/three/projectModels.jsx (PROJECT_MODELS):
 *   winery · basilica · church · house · tower · warehouse · pavilion · housing · lookout
 *
 * `specifications.area` es opcional: si no está, la tarjeta y el detalle simplemente
 * no muestran esa fila. Complétala cuando tengas la superficie real de cada proyecto.
 *
 * `isTemplate` marca los proyectos de ejemplo que rellenan el carrusel. Se muestran
 * con una etiqueta "Ejemplo" para que no se confundan con trabajo real: **sustitúyelos
 * por proyectos tuyos antes de publicar** y borra la marca.
 */
export const mockProjects = [
  {
    id: "1",
    title: "Bóvedas de Vino",
    category: "commercial",
    model: "winery",
    description: "Participé en el desarrollo de este proyecto integrando las especialidades eléctrica y estructural, colaborando con la empresa PointCloud en el levantamiento, modelamiento y coordinación técnica de las instalaciones.",
    shortDescription: "Proyecto especialidades eléctrica y estructural",
    images: [
      {
        id: "1",
        url: "/p2.jpg",
        alt: "Bóvedas de Vino — fachada principal",
        caption: "Fachada principal",
        isPrimary: true
      }
    ],
    specifications: {
      location: "Pirque, Chile",
      year: 2024,
      client: "Familia González"
    },
    tags: ["comercial", "especialidades", "levantamiento"],
    featured: true
  },
  {
    id: "2",
    title: "Proyecto Basílica de La Merced",
    category: "patrimonial",
    model: "basilica",
    description: "Participé en la intervención de este inmueble patrimonial, desarrollando labores en el área de paisaje, integrando y levantando los distintos elementos y artefactos del entorno, además de colaborar en trabajos asociados a la fachada del proyecto.",
    shortDescription: "Intervención inmueble patrimonial",
    images: [
      {
        id: "2",
        url: "/p1.jpg",
        alt: "Basílica de La Merced — área de trabajo principal",
        caption: "Área de trabajo principal",
        isPrimary: true
      }
    ],
    specifications: {
      location: "Santiago Centro, Chile",
      year: 2024
    },
    tags: ["patrimonial", "paisaje", "fachada"],
    featured: true
  },
  {
    id: "3",
    title: "Proyecto Iglesia El Buen Pastor",
    category: "patrimonial",
    model: "church",
    description: "Participé en la elaboración y desarrollo de la fachada de la iglesia, así como en el levantamiento y modelamiento del contexto del proyecto, colaborando con la empresa PointCloud.",
    shortDescription: "Elaboración y desarrollo de la fachada de la iglesia",
    images: [
      {
        id: "3",
        url: "/p3.jpg",
        alt: "Iglesia El Buen Pastor — fachada",
        caption: "Fachada de la iglesia",
        isPrimary: true
      }
    ],
    specifications: {
      location: "Independencia, Chile",
      year: 2022
    },
    tags: ["patrimonial", "fachada", "levantamiento"],
    featured: true
  },

  /* ------------------------------------------------------------------------
     Proyectos de ejemplo. Rellenan el carrusel para poder probarlo con varios
     elementos. Sustitúyelos por proyectos reales y quita `isTemplate`.
     ------------------------------------------------------------------------ */
  {
    id: "4",
    title: "Casa Chicureo",
    category: "residential",
    model: "house",
    isTemplate: true,
    description: "Vivienda unifamiliar de dos volúmenes con cubierta a dos aguas. Incluye el desarrollo completo de planos de arquitectura, detalles constructivos y la documentación para el permiso de edificación.",
    shortDescription: "Vivienda unifamiliar con cubierta a dos aguas",
    images: [],
    specifications: {
      location: "Chicureo, Colina",
      year: 2025
    },
    tags: ["residencial", "vivienda", "permiso"],
    featured: false
  },
  {
    id: "5",
    title: "Edificio Mirador",
    category: "commercial",
    model: "tower",
    isTemplate: true,
    description: "Edificio de oficinas en tres volúmenes escalonados. Coordinación de especialidades y desarrollo de las plantas tipo, fachadas y detalles de la envolvente.",
    shortDescription: "Oficinas en volúmenes escalonados",
    images: [],
    specifications: {
      location: "Providencia, Santiago",
      year: 2025
    },
    tags: ["comercial", "oficinas", "coordinación"],
    featured: false
  },
  {
    id: "6",
    title: "Galpón Quilicura",
    category: "industrial",
    model: "warehouse",
    isTemplate: true,
    description: "Nave industrial de planta libre con lucernario central y sala de procesos anexa. Planos de plantas, cortes, estructuras y cubicaciones.",
    shortDescription: "Nave industrial de planta libre",
    images: [],
    specifications: {
      location: "Quilicura, Santiago",
      year: 2023
    },
    tags: ["industrial", "nave", "estructura"],
    featured: false
  },
  {
    id: "7",
    title: "Pabellón Ñuñoa",
    category: "renovation",
    model: "pavilion",
    isTemplate: true,
    description: "Ampliación de una vivienda existente mediante un pabellón liviano de cubierta plana. Levantamiento del estado actual e integración con la obra original.",
    shortDescription: "Ampliación con pabellón de cubierta plana",
    images: [],
    specifications: {
      location: "Ñuñoa, Santiago",
      year: 2024
    },
    tags: ["remodelación", "ampliación", "levantamiento"],
    featured: false
  },
  {
    id: "8",
    title: "Conjunto Los Aromos",
    category: "residential",
    model: "housing",
    isTemplate: true,
    description: "Conjunto de tres viviendas de cubierta plana organizadas alrededor de un patio común. Plantas, emplazamiento y documentación técnica del conjunto.",
    shortDescription: "Tres viviendas alrededor de un patio",
    images: [],
    specifications: {
      location: "Maipú, Santiago",
      year: 2025
    },
    tags: ["residencial", "conjunto", "patio"],
    featured: false
  },
  {
    id: "9",
    title: "Mirador San Cristóbal",
    category: "commercial",
    model: "lookout",
    isTemplate: true,
    description: "Mirador de dos niveles con estructura cilíndrica y balcones perimetrales. Desarrollo de planos de arquitectura y detalles de las barandas y accesos.",
    shortDescription: "Mirador de dos niveles con balcones",
    images: [],
    specifications: {
      location: "Recoleta, Santiago",
      year: 2026
    },
    tags: ["comercial", "mirador", "estructura"],
    featured: false
  }
];

/**
 * Servicios ofrecidos.
 *
 * `examples` está vacío a propósito: apuntaba a /images/services/*.jpg, archivos que
 * no existen en public/ (generaban 404 y huecos en blanco). Agrega rutas reales cuando
 * tengas imágenes de ejemplo; recuerda incluirlas en scripts/optimize-images.mjs.
 */
export const mockServices = [
  {
    id: "1",
    title: "Planos Arquitectónicos",
    category: "design",
    description: "Desarrollo completo de planos arquitectónicos para proyectos residenciales y comerciales.",
    features: [
      "Planos de plantas",
      "Elevaciones y cortes",
      "Detalles constructivos",
      "Especificaciones técnicas"
    ],
    deliverables: [
      "Planos en formato DWG",
      "PDF para presentación",
      "Memoria técnica",
      "Especificaciones de materiales"
    ],
    estimatedTimeframe: "2-4 semanas",
    priceRange: "$500.000 - $1.500.000",
    examples: []
  },
  {
    id: "2",
    title: "Consultoría Técnica",
    category: "consultation",
    description: "Asesoría especializada en normativas de construcción y optimización de proyectos.",
    features: [
      "Revisión de normativas",
      "Optimización de espacios",
      "Asesoría en permisos",
      "Análisis de factibilidad"
    ],
    deliverables: [
      "Informe técnico",
      "Recomendaciones",
      "Cronograma de trabajo",
      "Presupuesto estimado"
    ],
    estimatedTimeframe: "1-2 semanas",
    priceRange: "$200.000 - $800.000",
    examples: []
  },
  {
    id: "3",
    title: "Documentación de Obra",
    category: "documentation",
    description: "Preparación completa de documentación técnica para permisos y construcción.",
    features: [
      "Documentos municipales",
      "Planos de especialidades",
      "Cálculos estructurales",
      "Memoria de cálculo"
    ],
    deliverables: [
      "Carpeta técnica completa",
      "Formularios municipales",
      "Planos sellados",
      "Documentación legal"
    ],
    estimatedTimeframe: "3-6 semanas",
    priceRange: "$800.000 - $2.000.000",
    examples: []
  }
];
