# FarmaAlerta 💊

Aplicación móvil desarrollada con React Native + Expo que permite a usuarios crear alertas de disponibilidad de medicamentos en farmacias. La app notifica automáticamente cuando un medicamento buscado vuelve a estar disponible.

**Tech Stack**: React Native + Expo Router + TypeScript + Google Apps Script + imgbb

## 🚀 Quick Start

```bash
# 1. Clonar repositorio
git clone <URL_REPOSITORIO> && cd FarmaAlerta

# 2. Instalar dependencias
npm install

# 3. Configurar backend (ver sección Backend Setup)
# - Crear Google Apps Script (docs/google-apps-script.js)
# - Obtener imgbb API Key

# 4. Crear archivo .env
echo "EXPO_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_ID/usercache" > .env

# 5. Iniciar app
npx expo start
```

## 📋 Tabla de contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Características principales](#características-principales)
- [API y Backend](#api-y-backend)
- [Contribución](#contribución)
- [Licencia](#licencia)

## ✨ Características

- 🔔 **Alertas inteligentes**: Crear alertas de medicamentos con disponibilidad automática
- 📱 **Interfaz moderna**: Diseño dark mode con animaciones premium
- 🎨 **Animaciones fluidas**: Transiciones parallax, shimmer, stagger y morfing
- 📍 **Farmacias cercanas**: Buscar medicamentos por ubicación
- 💾 **Almacenamiento local**: Persistencia de alertas con AsyncStorage
- 🔐 **Autenticación**: Sistema de login y registro
- 🎯 **Notificaciones hápticas**: Feedback táctil en acciones importantes
- 🌙 **Modo oscuro**: Interfaz optimizada para baja luz
- 🛍️ **Detalles de medicamentos**: Información completa, precios y disponibilidad

## 🛠️ Tecnologías

### Frontend

- **React Native** - Framework multiplataforma
- **Expo** - Plataforma para React Native
- **Expo Router** - Enrutamiento basado en archivos
- **TypeScript** - Tipado estático
- **Animated API** - Animaciones nativas
- **AsyncStorage** - Almacenamiento local

### Dependencias principales

```json
{
  "expo": "^53.0.0",
  "react-native": "0.76.0",
  "expo-router": "^3.5.20",
  "expo-haptics": "^13.0.1",
  "expo-constants": "^16.0.1",
  "@react-native-async-storage/async-storage": "^1.23.0"
}
```

### Backend

- **Google Apps Script** - Backend serverless para gestión de datos
- **API REST** - Endpoints para productos, farmacias y disponibilidad

## 📦 Requisitos previos

- Node.js >= 18.x
- npm >= 9.x o yarn >= 3.x
- Expo CLI instalado globalmente
- Android SDK (para emulador Android) O Xcode (para simulador iOS)
- Una cuenta en Google Cloud (para Google Apps Script)

### Instalación de dependencias globales

```bash
# Instalar Expo CLI
npm install -g expo-cli

# Verificar instalación
expo --version
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_REPOSITORIO>
cd FarmaAlerta
```

### 2. Instalar dependencias

```bash
npm install
```

O con yarn:

```bash
yarn install
```

### 3. Instalar Expo Go (en dispositivo físico)

Descarga la app "Expo Go" desde:

- [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
- [Google Play (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

## ⚙️ Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercache
EXPO_PUBLIC_API_BASE_URL=https://your-api-endpoint.com
EXPO_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
```

### Configuración de Expo

El proyecto usa `app.json` para configuración de Expo:

```json
{
  "expo": {
    "name": "FarmaAlerta",
    "slug": "farma-alerta",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"]
  }
}
```

### Guía rápida de setup completo

Para ejecutar la aplicación desde cero, sigue estos pasos:

#### 1. Backend (Google Apps Script)

- [Ver sección: Configuración de Google Apps Script](#configuración-de-google-apps-script)

#### 2. Imágenes (imgbb)

- [Ver sección: Almacenamiento de Imágenes en imgbb](#almacenamiento-de-imágenes-en-imgbb)

#### 3. Aplicación local

```bash
npm install
npm run start
```

#### 4. Verificar todo funciona

- Abre Expo Go en tu dispositivo
- Escanea el código QR
- Intenta crear una alerta
- Verifica que los datos se sincronicen

## 🏃 Ejecución

### Desarrollo local con Expo Go

```bash
# Iniciar servidor Expo
npx expo start --clear

# En la terminal aparecerán opciones:
# - Presiona 'i' para abrir en simulador iOS
# - Presiona 'a' para abrir en emulador Android
# - Escanea el código QR con Expo Go en tu dispositivo
```

### En emulador Android

```bash
npx expo start
# Presiona 'a' en la terminal
```

### En simulador iOS (solo macOS)

```bash
npx expo start
# Presiona 'i' en la terminal
```

### En dispositivo físico

```bash
npx expo start
# Escanea el código QR mostrado con la cámara
# Se abrirá automáticamente en Expo Go
```

### Build de producción

```bash
# Build Android
eas build --platform android

# Build iOS
eas build --platform ios

# Build universal
eas build --platform all
```

## 📁 Estructura del proyecto

```
FarmaAlerta/
├── app/                          # Pantallas y enrutamiento
│   ├── (tabs)/                   # Pantallas con tab navigation
│   │   ├── _layout.tsx           # Layout principal con tabs
│   │   ├── index.tsx             # Dashboard principal
│   │   └── explore.tsx           # Exploración de medicamentos
│   ├── login.tsx                 # Pantalla de login
│   ├── register.tsx              # Pantalla de registro
│   ├── welcome.tsx               # Pantalla de bienvenida
│   ├── modal.tsx                 # Modal genérico
│   └── _layout.tsx               # Root layout
├── components/                   # Componentes reutilizables
│   ├── alert-toast.tsx           # Toast de notificaciones
│   ├── MorphingBellIcon.tsx       # Icono de campana animado
│   ├── ParallaxImage.tsx          # Imagen con efecto parallax
│   ├── ShimmerLoader.tsx          # Loader con efecto shimmer
│   ├── StaggerView.tsx            # Animación escalonada
│   ├── SwipeableAlert.tsx         # Alerta deslizable
│   ├── themed-text.tsx            # Texto con tema
│   ├── themed-view.tsx            # Vista con tema
│   ├── ui/                        # Componentes UI base
│   └── external-link.tsx
├── contexts/                     # Context API
│   ├── AlertasContext.tsx         # Gestión de alertas
│   ├── UserContext.tsx            # Datos del usuario
│   ├── FarmaciaContext.tsx         # Información de farmacias
│   └── ProductoContext.tsx         # Datos de productos
├── hooks/                        # Custom hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   ├── use-theme-color.ts
│   ├── use-notificaciones.ts       # Hook de notificaciones
│   └── useHapticAnimation.ts       # Hook de animación háptica
├── constants/                    # Constantes
│   └── theme.ts                  # Tema y colores
├── utils/                        # Funciones utilitarias
│   └── stockColors.ts            # Colores por stock
├── assets/                       # Recursos estáticos
│   └── images/
├── package.json
├── app.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```

## 🎯 Características principales

### 1. Sistema de Alertas

- Crear alertas de medicamentos
- Monitoreo automático de disponibilidad
- Notificaciones cuando el medicamento está disponible
- Cancelar o editar alertas activas
- Historial de alertas completadas

### 2. Búsqueda de medicamentos

- Buscar por nombre o código
- Filtrar por categoría
- Ver disponibilidad en farmacias cercanas
- Consultar precios y stock

### 3. Gestión de farmacias

- Ubicación de farmacias
- Horarios de atención
- Teléfono de contacto
- Disponibilidad de medicamentos

### 4. Interfaz de usuario

- Tema oscuro optimizado
- Animaciones fluidas:
  - Parallax en imágenes
  - Shimmer en carga
  - Stagger en listas
  - Morfing en iconos
  - Swipe para eliminar
- Feedback háptico en interacciones

### 5. Autenticación

- Registro de nuevos usuarios
- Login seguro
- Persistencia de sesión

## 🔌 API y Backend

### Google Apps Script

El backend utiliza Google Apps Script como servidor sin costo. Esta es una solución serverless ideal para desarrollo.

#### Configuración de Google Apps Script

##### Paso 1: Crear un nuevo proyecto en Google Apps Script

1. Accede a [Google Apps Script](https://script.google.com/)
2. Haz clic en **"Nuevo proyecto"**
3. Dale un nombre a tu proyecto: `FarmaAlerta Backend`

##### Paso 2: Copiar el código del script

1. Localiza el archivo de documentación con el código del Google Apps Script en la carpeta `docs/`
2. Abre ese archivo y copia todo el código
3. En el editor de Apps Script, elimina el código por defecto
4. Pega el código completo del proyecto

```javascript
// El archivo docs/google-apps-script.js contiene toda la lógica del backend
// Incluye funciones para:
// - Gestión de productos
// - Gestión de farmacias
// - Verificación de disponibilidad
// - Creación y gestión de alertas
```

##### Paso 3: Vincular una hoja de cálculo

1. En el editor de Apps Script, ve a **Proyecto** → **Configuración del proyecto**
2. En la sección "ID de la hoja de cálculo", pega el ID de tu Google Sheet
3. Alternativamente, crea una nueva hoja desde el menú **Ejecutar** → **Nueva implementación**

##### Paso 4: Obtener la URL del script

1. Haz clic en **Implementar** → **Nueva implementación**
2. Selecciona **Aplicación web** como tipo
3. Configura:
   - **Ejecutar como**: Tu cuenta de Google
   - **Quién tiene acceso**: Cualquiera
4. Haz clic en **Implementar**
5. Copia la URL que aparece (se parece a: `https://script.google.com/macros/d/SCRIPT_ID/usercache`)

##### Paso 5: Configurar la URL en tu proyecto

1. Crea un archivo `.env` en la raíz del proyecto (si no existe)
2. Agrega la URL obtenida:

```env
EXPO_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercache
```

3. Reinicia el servidor Expo: `npx expo start --clear`

#### Endpoints de Google Apps Script

```
GET /usercache?action=getProductos
   → Retorna lista de productos con disponibilidad

GET /usercache?action=getFarmacias
   → Retorna lista de farmacias

GET /usercache?action=verificar_disponibilidad&producto_id=XXX
   → Verifica disponibilidad de un producto específico

POST /usercache?action=crearAlerta
   → Crea una nueva alerta de disponibilidad

POST /usercache?action=actualizarStock
   → Actualiza el stock de un producto
```

#### Estructura de Google Sheet

El Google Apps Script espera los siguientes sheets en tu Google Sheet:

| Sheet         | Descripción                     | Columnas                                                                       |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| **Productos** | Catálogo de medicamentos        | ID, Nombre, Descripción, Precio, Categoría, Cantidad, EmailFarmacia, ImagenURL |
| **Farmacias** | Información de farmacias        | Email, Nombre, Ubicación, Teléfono, Horario                                    |
| **Alertas**   | Registro de alertas de usuarios | ID, UsuarioEmail, ProductoID, FechaCreación, Estado, FarmaciaEmail             |

### Almacenamiento de Imágenes en imgbb

Las imágenes de medicamentos se almacenan en **imgbb**, una plataforma gratuita de alojamiento de imágenes.

#### Configuración de imgbb

##### Paso 1: Crear una cuenta en imgbb

1. Accede a [imgbb.com](https://imgbb.com/)
2. Haz clic en **Sign Up**
3. Completa el registro (puedes usar Google, Facebook, etc.)

##### Paso 2: Obtener tu API Key

1. Una vez logueado, ve a tu perfil → **API**
2. Copia tu **API Key** única

##### Paso 3: Usar imgbb en Google Apps Script

En tu Google Apps Script, usa la API de imgbb para subir imágenes:

```javascript
// Ejemplo: Subir una imagen a imgbb
function subirImagenAImgbb(archivoBlob) {
  const apiKey = "YOUR_IMGBB_API_KEY";
  const url = "https://api.imgbb.com/1/upload";

  const payload = {
    image: Utilities.base64Encode(archivoBlob.getBytes()),
    key: apiKey,
    expiration: 15552000, // 6 meses en segundos
  };

  const options = {
    method: "post",
    payload: payload,
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  if (result.success) {
    return result.data.url; // URL de la imagen
  } else {
    throw new Error("Error al subir imagen: " + result.error.message);
  }
}
```

##### Paso 4: Almacenar URLs en Google Sheet

Cuando subes una imagen a imgbb, obtienes una URL. Esta URL se guarda en tu Google Sheet en la columna `ImagenURL`:

```
https://i.ibb.co/XXXXX/nombre-imagen.jpg
```

#### Ventajas de usar imgbb

✅ **Gratuito** - Hasta 15 GB de almacenamiento  
✅ **Rápido** - CDN global para entrega rápida  
✅ **Confiable** - URLs permanentes  
✅ **Sin límite de ancho de banda** - Unlimited views  
✅ **API simple** - Integración fácil con Apps Script  
✅ **HTTPS** - Seguro por defecto

### Estructura de datos

**Alerta:**

```typescript
{
  id: string;
  productoId: string;
  nombreMedicamento: string;
  estado: 'activa' | 'completada' | 'cancelada';
  activa: boolean;
  fechaCreacion: Date;
  fechaCompletada?: Date;
  farmaciasDisponibles?: Array<{ nombre: string; email: string }>;
}
```

**Producto:**

```typescript
{
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  cantidad: number;
  emailFarmacia: string;
}
```

**Farmacia:**

```typescript
{
  email: string;
  nombre: string;
  ubicacion: string;
  telefono: string;
  horario: string;
}
```

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint

# Ejecutar tests (si está configurado)
npm test
```

## 📱 Pantallas principales

| Pantalla                 | Descripción                           |
| ------------------------ | ------------------------------------- |
| **Welcome**              | Pantalla de bienvenida                |
| **Login**                | Autenticación de usuario              |
| **Register**             | Registro de nuevo usuario             |
| **Dashboard**            | Vista principal con alertas           |
| **Explore**              | Búsqueda de medicamentos              |
| **Alerts**               | Gestión de alertas activas            |
| **Medicamento Detalles** | Información detallada del medicamento |
| **Farmacia Detalles**    | Información de la farmacia            |

## 🎨 Tema y colores

```typescript
// Colores principales
Dark: #0d1411
Green: #1dc962
White: #f9fafb
Gray: #6b7280

// Precios
USD: $
```

## 🐛 Solución de problemas

### Problema: "expo-notifications error"

**Solución**: La app ya está optimizada para usar solo haptics. No necesita expo-notifications.

### Problema: "Datos no cargan"

**Solución**: Verifica que `EXPO_PUBLIC_GOOGLE_APPS_SCRIPT_URL` está correctamente configurado en `.env`

### Problema: "Animaciones lentas"

**Solución**: Cierra otras aplicaciones o usa un dispositivo/emulador más potente.

### Problema: "No se reciben notificaciones"

**Solución**: Las notificaciones usan feedback háptico. Verifica que los haptics estén habilitados en tu dispositivo.

## 📚 Recursos útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [Animated API](https://reactnative.dev/docs/animated)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

### v1.0.0 (Enero 2026)

- ✅ Sistema de alertas completo
- ✅ Búsqueda de medicamentos
- ✅ Gestión de farmacias
- ✅ Autenticación de usuarios
- ✅ Animaciones premium
- ✅ Notificaciones hápticas
- ✅ Interfaz dark mode

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 Autor

**FarmaAlerta Team**

## 📞 Contacto

Para reportar bugs o sugerencias, abre un issue en el repositorio.

---

**Última actualización**: Enero 2026
**Versión**: 1.0.0
