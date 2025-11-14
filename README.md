# Frontend - Búsqueda de Imágenes por Similitud Visual

Interfaz web moderna y responsiva para el sistema de búsqueda de imágenes por similitud visual utilizando IA. Construida con Next.js 15, React 19 y TypeScript.

## 🎨 Características

- **Interfaz Intuitiva**: Diseño limpio y moderno con Tailwind CSS
- **Drag & Drop**: Carga de imágenes mediante arrastrar y soltar
- **Vista Previa**: Visualización inmediata de la imagen cargada
- **Resultados Visuales**: Grid responsivo con imágenes similares y métricas de similitud
- **TypeScript**: Tipado estático para mayor robustez y mantenibilidad
- **SSR Ready**: Optimización automática con Next.js 15
- **Responsive Design**: Adaptable a todos los dispositivos (móvil, tablet, desktop)

## 📋 Requisitos Previos

- Node.js 20.x o superior
- npm o yarn
- Backend de búsqueda de imágenes corriendo en `http://localhost:8000`

## 🚀 Instalación y Configuración

### Desarrollo Local

1. **Clonar el repositorio:**

```bash
git clone https://github.com/matiasfgonzalez/frontend-busqueda-de-imagenes.git
cd frontend-busqueda-de-imagenes
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Ejecutar en modo desarrollo:**

```bash
npm run dev
```

4. **Abrir en el navegador:**

```
http://localhost:3000
```

### Con Docker

**Opción 1: Docker standalone**

```bash
docker build -t image-search-frontend .
docker run -p 3000:3000 image-search-frontend
```

**Opción 2: Docker Compose (recomendado)**

```bash
# Desde la raíz del proyecto (con backend incluido)
docker-compose up --build
```

## 📁 Estructura del Proyecto

```
frontend/
├── app/                      # App Router de Next.js 15
│   ├── favicon.ico          # Icono de la aplicación
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Layout raíz de la aplicación
│   └── page.tsx             # Página principal (búsqueda)
├── components/              # Componentes React reutilizables
│   ├── ImageResults.tsx     # Grid de resultados de búsqueda
│   └── ImageUpload.tsx      # Componente de carga de imágenes
├── public/                  # Archivos estáticos
├── .next/                   # Build output (generado)
├── node_modules/            # Dependencias (generado)
├── Dockerfile               # Configuración Docker
├── next.config.ts           # Configuración de Next.js
├── tailwind.config.ts       # Configuración de Tailwind CSS
├── tsconfig.json            # Configuración de TypeScript
├── package.json             # Dependencias y scripts
└── README.md                # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Iniciar en modo producción
npm start

# Linting del código
npm run lint
```

## 🎯 Componentes Principales

### **1. ImageUpload Component**

Componente para cargar imágenes mediante:

- **Click**: Abre selector de archivos
- **Drag & Drop**: Arrastra imágenes directamente
- **Vista Previa**: Muestra la imagen antes de buscar

**Props:**

- `onImageUpload: (file: File) => void` - Callback al subir imagen
- `loading: boolean` - Estado de carga durante búsqueda

**Características:**

- Validación de tipo de archivo (solo imágenes)
- Preview con overlay interactivo
- Estados de loading y error
- Diseño responsivo

### **2. ImageResults Component**

Grid de resultados con imágenes similares.

**Props:**

- `results: ImageResult[]` - Array de resultados de búsqueda

**Tipo ImageResult:**

```typescript
interface ImageResult {
  id: number;
  similarity: number; // 0.0 - 1.0
  path: string; // URL de la imagen
  distance: number; // Distancia euclidiana
}
```

**Características:**

- Grid responsivo (1-4 columnas según viewport)
- Métricas de similitud en porcentaje
- Distancia euclidiana para debugging
- Hover effects y transiciones
- Lazy loading de imágenes
- Fallback para imágenes no encontradas

### **3. Page Component (app/page.tsx)**

Página principal que integra todo el flujo de búsqueda.

**Funcionalidades:**

- Gestión de estado (imágenes, loading, errores)
- Comunicación con backend via Axios
- Manejo de errores con mensajes descriptivos
- UI condicional según estado

**Estados:**

```typescript
const [results, setResults] = useState<ImageResult[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## 🌐 API Integration

### **Endpoint de Búsqueda**

```typescript
POST http://localhost:8000/search-similar-images/

// Request
Content-Type: multipart/form-data
Body: {
  file: File (imagen)
}

// Response
{
  "results": [
    {
      "id": 1,
      "similarity": 0.95,
      "path": "http://localhost:8000/static/1.png",
      "distance": 0.1234
    },
    // ... más resultados
  ],
  "threshold": 0.5
}
```

### **Manejo de Errores**

El frontend maneja tres tipos de errores:

1. **Errores de servidor** (status 4xx/5xx)
2. **Errores de red** (servidor no disponible)
3. **Errores de validación** (archivo inválido)

## 🎨 Estilos y Diseño

### **Tailwind CSS**

Framework utility-first para estilos consistentes y responsivos.

**Breakpoints utilizados:**

- `sm`: 640px - Tablets pequeñas
- `md`: 768px - Tablets
- `lg`: 1024px - Laptops
- `xl`: 1280px - Desktops

**Paleta de colores:**

- Primario: Blue-500 (#3B82F6)
- Fondo: Gray-100 (#F3F4F6)
- Texto: Gray-900 (#111827)
- Bordes: Gray-300 (#D1D5DB)

### **Componentes UI**

- **Botones**: Efectos hover y estados disabled
- **Cards**: Sombras y bordes redondeados
- **Grid**: Flexbox y Grid CSS para layouts
- **Transiciones**: Smooth animations (duration-200/300)

## ⚙️ Configuración

### **next.config.ts**

```typescript
const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Desactiva optimización para evitar problemas con URLs externas
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/**"
      }
    ]
  }
};
```

**Importante:**

- `unoptimized: true` permite que las imágenes del backend se carguen directamente
- `remotePatterns` define los dominios permitidos para imágenes externas

### **Variables de Entorno (opcional)**

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Usar en código:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

## 🔒 CORS y Seguridad

El backend debe tener configurado CORS para permitir solicitudes desde el frontend:

```python
# Backend - main.py
allow_origins = ["http://localhost:3000", "http://localhost:3001"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Performance y Optimizaciones

### **Optimizaciones Implementadas**

- ✅ **Code Splitting**: Carga automática de chunks por Next.js
- ✅ **Lazy Loading**: Imágenes se cargan según visibilidad
- ✅ **Static Generation**: Páginas pre-renderizadas cuando es posible
- ✅ **TypeScript**: Detección de errores en tiempo de compilación
- ✅ **ESLint**: Linting automático del código

### **Métricas de Lighthouse**

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

## 🐛 Troubleshooting

### **Las imágenes no se cargan**

**Problema:** Error 404 al cargar imágenes desde el backend

**Solución:**

1. Verificar que el backend esté corriendo en `http://localhost:8000`
2. Confirmar que `next.config.ts` tenga `unoptimized: true`
3. Revisar que las URLs en el response incluyan extensión (`.png`, `.jpg`)

### **CORS Error**

**Problema:** `Access to XMLHttpRequest blocked by CORS policy`

**Solución:**

1. Verificar configuración de CORS en el backend
2. Asegurar que `http://localhost:3000` esté en `allow_origins`
3. Reiniciar el backend después de cambios en CORS

### **Build Errors**

**Problema:** Errores de tipo TypeScript al hacer build

**Solución:**

```bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run build
```

## 🚢 Deployment

### **Vercel (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configurar variables de entorno en Vercel:

- `NEXT_PUBLIC_API_URL`: URL del backend en producción

### **Docker Production**

```dockerfile
# Dockerfile ya configurado para producción
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Otras Plataformas**

- **AWS Amplify**: Soporte nativo para Next.js
- **Netlify**: Deploy desde GitHub
- **Railway**: Deploy con Docker

## 📚 Stack Tecnológico

| Tecnología   | Versión | Propósito                   |
| ------------ | ------- | --------------------------- |
| Next.js      | 15.1.8  | Framework React con SSR     |
| React        | 19.0.0  | Librería UI                 |
| TypeScript   | 5.x     | Tipado estático             |
| Tailwind CSS | 3.4.1   | Framework CSS utility-first |
| Axios        | 1.9.0   | Cliente HTTP                |
| Lucide React | 0.542.0 | Iconos (opcional)           |
| ESLint       | 9.x     | Linting                     |

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **Guías de Estilo**

- Usar TypeScript para todos los archivos
- Seguir convenciones de nombres de Next.js
- Componentes en PascalCase
- Funciones en camelCase
- Usar Tailwind para estilos (evitar CSS custom cuando sea posible)

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 🔗 Enlaces

- **Backend**: [github.com/matiasfgonzalez/backend-busqueda-de-imagenes](https://github.com/matiasfgonzalez/backend-busqueda-de-imagenes)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)

## 👨‍💻 Autor

**Matías González**

- GitHub: [@matiasfgonzalez](https://github.com/matiasfgonzalez)

---

**¿Preguntas o sugerencias?** Abre un issue en GitHub o contáctame directamente.
