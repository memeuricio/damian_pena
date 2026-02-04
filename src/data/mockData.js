// Mock data for development and testing

export const professionalProfile = {
  personalInfo: {
    fullName: "Damián Peña",
    title: "Dibujante Arquitectónico Titulado",
    photo: "/images/profile/damian-pena.jpg", // Placeholder path
    email: "damian.pena@email.com",
    phone: "+56 9 1234 5678",
    location: "Santiago, Chile",
    summary: "Dibujante arquitectónico con experiencia en proyectos residenciales y comerciales, especializado en planos técnicos y visualización arquitectónica."
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

export const mockProjects = [
  {
    id: "1",
    title: "Casa Unifamiliar Los Andes",
    category: "residential",
    description: "Proyecto de casa unifamiliar de 120m² con diseño moderno y funcional.",
    shortDescription: "Casa unifamiliar moderna de 120m²",
    images: [
      {
        id: "1",
        url: "/images/projects/casa-los-andes-1.jpg",
        alt: "Vista frontal Casa Los Andes",
        caption: "Fachada principal",
        isPrimary: true
      }
    ],
    specifications: {
      area: "120m²",
      location: "Los Andes, Chile",
      year: 2023,
      client: "Familia González"
    },
    tags: ["residencial", "moderno", "sustentable"],
    featured: true
  },
  {
    id: "2",
    title: "Oficinas Comerciales Centro",
    category: "commercial",
    description: "Diseño de oficinas comerciales de 300m² en el centro de Santiago.",
    shortDescription: "Oficinas comerciales 300m²",
    images: [
      {
        id: "2",
        url: "/images/projects/oficinas-centro-1.jpg",
        alt: "Interior oficinas centro",
        caption: "Área de trabajo principal",
        isPrimary: true
      }
    ],
    specifications: {
      area: "300m²",
      location: "Santiago Centro, Chile",
      year: 2023,
      client: "Empresa XYZ"
    },
    tags: ["comercial", "oficinas", "corporativo"],
    featured: true
  },
  {
    id: "3",
    title: "Remodelación Casa Patrimonial",
    category: "renovation",
    description: "Remodelación y restauración de casa patrimonial manteniendo elementos originales.",
    shortDescription: "Remodelación casa patrimonial",
    images: [
      {
        id: "3",
        url: "/images/projects/casa-patrimonial-1.jpg",
        alt: "Casa patrimonial remodelada",
        caption: "Fachada restaurada",
        isPrimary: true
      }
    ],
    specifications: {
      area: "180m²",
      location: "Valparaíso, Chile",
      year: 2022,
      client: "Municipalidad de Valparaíso"
    },
    tags: ["patrimonial", "restauración", "histórico"],
    featured: false
  }
];

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
    examples: ["/images/services/planos-ejemplo-1.jpg"]
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
    examples: ["/images/services/consultoria-ejemplo-1.jpg"]
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
    examples: ["/images/services/documentacion-ejemplo-1.jpg"]
  }
];