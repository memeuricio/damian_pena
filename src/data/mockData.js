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
    title: "Bóvedas de Vino",
    category: "commercial",
    description: "Participé en el desarrollo de este proyecto integrando las especialidades eléctrica y estructural, colaborando con la empresa PointCloud en el levantamiento, modelamiento y coordinación técnica de las instalaciones.",
    shortDescription: "Proyecto especialidades eléctrica y estructural",
    images: [
      {
        id: "1",
        url: "/p2.jpeg",
        alt: "Vista frontal Casa Los Andes",
        caption: "Fachada principal",
        isPrimary: true
      }
    ],
    specifications: {
      location: "Pirque, Chile",
      year: 2024,
      client: "Familia González"
    },
    tags: ["commercial", "moderno", "sustentable"],
    featured: true
  },
  {
    id: "2",
    title: "Proyecto Basílica de La Merced",
    category: "Patrimonio",
    description: "Participé en la intervención de este inmueble patrimonial, desarrollando labores en el área de paisaje, integrando y levantando los distintos elementos y artefactos del entorno, además de colaborar en trabajos asociados a la fachada del proyecto.",
    shortDescription: "Intervención inmueble patrimonial",
    images: [
      {
        id: "2",
        url: "/p1.jpeg",
        alt: "Interior oficinas centro",
        caption: "Área de trabajo principal",
        isPrimary: true
      }
    ],
    specifications: {
      location: "Santiago Centro, Chile",
      year: 2024,
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