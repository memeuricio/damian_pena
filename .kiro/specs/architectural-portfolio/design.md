# Design Document: Architectural Portfolio

## Overview

El portafolio arquitectónico de Damián Peña será una aplicación web React moderna con diseño minimalista y profesional. La arquitectura se enfocará en la reutilización de componentes, performance optimizada y experiencia de usuario fluida. Utilizaremos React con JavaScript, Tailwind CSS para estilos, y una estructura modular que facilite el mantenimiento y escalabilidad.

## Architecture

### Frontend Architecture
- **Framework**: React 18 con JavaScript
- **Styling**: Tailwind CSS para diseño utility-first
- **Routing**: React Router para navegación SPA
- **State Management**: React Context API para estado global mínimo
- **Build Tool**: Vite para desarrollo y build optimizado
- **Asset Management**: Lazy loading para imágenes y code splitting

### Component Architecture
```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Componentes base (Button, Card, Modal)
│   ├── layout/          # Layout components (Header, Footer, Navigation)
│   └── sections/        # Componentes específicos de sección
├── pages/               # Páginas principales
├── hooks/               # Custom hooks
├── utils/               # Utilidades y helpers
├── assets/              # Imágenes, iconos, documentos
└── styles/              # Configuración de Tailwind y estilos globales
```

## Components and Interfaces

### Core Layout Components

#### Navigation Component
```javascript
// components/layout/Navigation.jsx
interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  isMobile: boolean;
}
```

#### Header Component
```javascript
// components/layout/Header.jsx
interface HeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  overlay?: boolean;
}
```

### Content Components

#### ProjectCard Component
```javascript
// components/sections/ProjectCard.jsx
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    description: string;
    year: number;
  };
  onClick: (projectId: string) => void;
}
```

#### ServiceCard Component
```javascript
// components/sections/ServiceCard.jsx
interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    features: string[];
    estimatedTime: string;
    category: string;
  };
}
```

#### ContactForm Component
```javascript
// components/sections/ContactForm.jsx
interface ContactFormProps {
  onSubmit: (formData: ContactFormData) => void;
  isLoading: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}
```

### Common Components

#### Button Component
```javascript
// components/common/Button.jsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

#### Modal Component
```javascript
// components/common/Modal.jsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size: 'sm' | 'md' | 'lg' | 'xl';
}
```

## Data Models

### Project Model
```javascript
interface Project {
  id: string;
  title: string;
  category: 'residential' | 'commercial' | 'industrial' | 'renovation';
  description: string;
  shortDescription: string;
  images: ProjectImage[];
  specifications: {
    area: string;
    location: string;
    year: number;
    client?: string;
  };
  tags: string[];
  featured: boolean;
}

interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
}
```

### Service Model
```javascript
interface Service {
  id: string;
  title: string;
  category: 'design' | 'consultation' | 'documentation' | 'renovation';
  description: string;
  features: string[];
  deliverables: string[];
  estimatedTimeframe: string;
  priceRange?: string;
  examples: string[]; // Array de URLs de imágenes ejemplo
}
```

### Professional Profile Model
```javascript
interface ProfessionalProfile {
  personalInfo: {
    fullName: string;
    title: string;
    photo: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: Education[];
  experience: WorkExperience[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  description?: string;
}

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}
```

## Page Structure

### Home Page (`/`)
- Hero section con introducción profesional
- Featured projects preview
- Services overview
- Call-to-action para contacto

### Portfolio Page (`/portfolio`)
- Project gallery con filtros por categoría
- Search functionality
- Project detail modal/page

### Services Page (`/services`)
- Service cards organizados por categoría
- Detailed service descriptions
- Pricing information (si aplica)

### About/CV Page (`/about`)
- Professional photo y bio
- Education timeline
- Work experience
- Skills y competencias
- Downloadable CV

### Contact Page (`/contact`)
- Contact form
- Contact information
- Location map (si aplica)
- Social media links

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Ahora voy a analizar los criterios de aceptación para determinar cuáles son testables como propiedades.

### Property Reflection

Después de revisar todas las propiedades identificadas como testables, he identificado algunas redundancias y oportunidades de consolidación:

- Las propiedades relacionadas con la visualización de contenido (proyectos, servicios, CV) pueden consolidarse en propiedades más amplias sobre renderizado de contenido
- Las propiedades de navegación y responsividad pueden combinarse para evitar duplicación
- Las propiedades de formularios pueden unificarse en una propiedad más comprehensiva sobre validación

### Converting EARS to Properties

Basándome en el análisis de prework, estas son las propiedades de corrección consolidadas:

**Property 1: Portfolio Content Display**
*For any* portfolio page visit, the system should display all available projects with their required information (title, category, description, images) properly organized by categories
**Validates: Requirements 1.1, 1.3**

**Property 2: Project Interaction Behavior**
*For any* project in the gallery, clicking on it should display detailed information including all specifications (type, dimensions, technical details) and provide image zoom functionality
**Validates: Requirements 1.2, 1.5**

**Property 3: CV Section Completeness**
*For any* CV section access, the system should display all required professional information including photo, education, experience, skills, and provide downloadable PDF functionality
**Validates: Requirements 2.1, 2.2, 2.3, 2.5**

**Property 4: Services Information Display**
*For any* services section, the system should display all services properly categorized with complete information including descriptions, deliverables, timeframes, and detailed views
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

**Property 5: Contact Form Validation**
*For any* contact form submission, the system should validate all required fields (name, email, phone, project type, message) and prevent submission with invalid or missing data
**Validates: Requirements 4.1, 4.2**

**Property 6: Contact Information Availability**
*For any* contact page access, the system should display all contact information and provide multiple communication channels with call-to-action elements
**Validates: Requirements 4.3, 4.4, 4.5**

**Property 7: Navigation Consistency**
*For any* page in the application, the navigation menu should be accessible and provide consistent functionality, with responsive hamburger menu on mobile devices
**Validates: Requirements 5.1, 5.4**

**Property 8: Breadcrumb Navigation**
*For any* deep content section, the system should display breadcrumb navigation showing the correct path
**Validates: Requirements 5.5**

**Property 9: Responsive Layout Adaptation**
*For any* viewport size (desktop, tablet, mobile), the system should adapt its layout appropriately while maintaining full functionality with touch-friendly interfaces
**Validates: Requirements 6.1, 6.2**

**Property 10: Accessibility Focus Indicators**
*For any* interactive element, keyboard navigation should provide visible focus indicators
**Validates: Requirements 6.4**

**Property 11: Loading States Display**
*For any* asynchronous operation, the system should display appropriate loading states and transitions
**Validates: Requirements 7.5**

**Property 12: Image Lazy Loading**
*For any* image in the application, lazy loading should be implemented to optimize performance
**Validates: Requirements 8.2**

## Error Handling

### Form Validation Errors
- Display clear, user-friendly error messages for invalid form inputs
- Highlight invalid fields with visual indicators
- Prevent form submission until all validation passes
- Provide real-time validation feedback

### Image Loading Errors
- Display placeholder or fallback images when original images fail to load
- Implement retry mechanisms for failed image loads
- Graceful degradation for missing project images

### Navigation Errors
- Handle invalid routes with appropriate 404 pages
- Provide navigation back to valid sections
- Maintain application state during navigation errors

### Performance Degradation
- Implement loading skeletons for slow content
- Progressive image loading with low-quality placeholders
- Graceful handling of slow network conditions

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests:**
- Specific examples of component rendering
- Edge cases like empty data sets or missing images
- Error conditions and form validation scenarios
- Integration points between components
- Accessibility features and keyboard navigation

**Property-Based Tests:**
- Universal properties that hold across all inputs
- Component behavior with randomized data
- Responsive design across different viewport sizes
- Form validation with various input combinations
- Navigation consistency across all pages

### Property-Based Testing Configuration

- **Testing Library**: React Testing Library with @fast-check/jest for property-based testing
- **Minimum Iterations**: 100 iterations per property test
- **Test Tagging**: Each property test must reference its design document property using the format:
  ```javascript
  // Feature: architectural-portfolio, Property 1: Portfolio Content Display
  ```

### Testing Framework Setup

```javascript
// Testing stack:
// - Jest as test runner
// - React Testing Library for component testing
// - @fast-check/jest for property-based testing
// - @testing-library/user-event for user interaction simulation
// - jest-axe for accessibility testing
```

### Test Organization

```
src/
├── __tests__/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── sections/
│   ├── pages/
│   ├── utils/
│   └── integration/
└── test-utils/
    ├── generators.js      # Property test data generators
    ├── test-helpers.js    # Common test utilities
    └── mock-data.js       # Mock data for tests
```

The testing approach ensures that both specific examples work correctly (unit tests) and that the system behaves properly across all possible inputs (property tests), providing comprehensive validation of the portfolio system's correctness.