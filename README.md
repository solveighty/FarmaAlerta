# FarmaAlerta Backend API

Backend API para la aplicación FarmaAlerta - gestión de medicamentos, farmacias y disponibilidad en tiempo real.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación basado en JWT
- **Gestión de Usuarios**: Soporte para diferentes roles (pacientes, administradores de farmacia, administradores del sistema)
- **Base de Datos PostgreSQL**: Almacenamiento persistente con TypeORM
- **Caché con Redis**: Mejora de rendimiento con caching distribuido
- **API RESTful**: Endpoints bien documentados con Swagger
- **Validación de Datos**: Validación automática con class-validator
- **Logging**: Sistema de logging con Winston
- **CORS**: Soporte para solicitudes cross-origin
- **Compresión**: Compresión de respuestas HTTP
- **Helmet**: Seguridad HTTP headers

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm o yarn
- PostgreSQL >= 12
- Redis >= 6.0 (opcional pero recomendado)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone [url-repositorio]
cd farmaalerta-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Application
NODE_ENV=development
APP_PORT=3000
APP_HOST=localhost

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=farmaalerta_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api/docs
```

### 4. Crear base de datos

```sql
CREATE DATABASE farmaalerta_db;
```

## 🚀 Uso

### Desarrollo

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

### Tests

```bash
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## 📚 Documentación de API

La documentación interactiva de la API está disponible en:

```
http://localhost:3000/api/docs
```

### Endpoints Principales

#### Authentication
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/refresh` - Refrescar token

#### Users
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### Medicines
- `GET /medicines` - Obtener todos los medicamentos
- `GET /medicines/:id` - Obtener medicamento por ID
- `GET /medicines/search?q=query` - Buscar medicamentos
- `POST /medicines` - Crear medicamento
- `PATCH /medicines/:id` - Actualizar medicamento
- `DELETE /medicines/:id` - Eliminar medicamento

#### Pharmacies
- `GET /pharmacies` - Obtener todas las farmacias
- `GET /pharmacies/:id` - Obtener farmacia por ID
- `GET /pharmacies/search?q=query` - Buscar farmacias
- `POST /pharmacies` - Crear farmacia
- `PATCH /pharmacies/:id` - Actualizar farmacia
- `DELETE /pharmacies/:id` - Eliminar farmacia

#### Search
- `GET /search?q=query` - Búsqueda global
- `GET /search/medicines?q=query` - Buscar medicamentos
- `GET /search/pharmacies?q=query` - Buscar farmacias

## 📁 Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada de la aplicación
├── app.module.ts              # Módulo principal
├── app.service.ts             # Servicios de la aplicación
├── app.controller.ts          # Controladores principales
│
├── config/                    # Configuraciones globales
│   ├── database.config.ts     # Configuración de base de datos
│   ├── redis.config.ts        # Configuración de Redis
│   ├── logger.config.ts       # Configuración de logging
│   └── swagger.config.ts      # Configuración de Swagger
│
├── common/                    # Componentes comunes
│   ├── decorators/            # Decoradores personalizados
│   ├── filters/               # Filtros de excepciones
│   ├── interceptors/          # Interceptores
│   ├── pipes/                 # Pipes de validación
│   └── dtos/                  # DTOs genéricos
│
├── modules/                   # Módulos de negocio
│   ├── auth/                  # Autenticación
│   ├── users/                 # Gestión de usuarios
│   ├── pharmacies/            # CRUD de farmacias
│   ├── medicines/             # CRUD de medicamentos
│   ├── search/                # Búsqueda global
│   ├── alerts/                # Sistema de alertas
│   └── audit/                 # Auditoría
│
├── redis/                     # Módulo Redis
│   └── redis.module.ts
│
└── logger/                    # Servicio de logging
    ├── logger.module.ts
    └── logger.service.ts
```

## 🔐 Seguridad

- Las contraseñas se hashean con bcrypt
- JWT para autenticación stateless
- Validación de entrada con class-validator
- CORS configurable
- Helmet para seguridad HTTP
- Rate limiting (a implementar)
- Input sanitization (a implementar)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📧 Soporte

Para reportar bugs o solicitar features, por favor crea un issue en el repositorio.

## ✅ Checklist de Desarrollo

- [ ] Implementar validación completa de DTOs
- [ ] Configurar autenticación JWT
- [ ] Implementar sistema de roles y permisos
- [ ] Configurar base de datos PostgreSQL
- [ ] Configurar Redis para caché
- [ ] Implementar paginación en todos los endpoints
- [ ] Configurar logging con Winston
- [ ] Implementar tests unitarios
- [ ] Implementar tests de integración
- [ ] Configurar CI/CD
- [ ] Documentar API con Swagger completo
- [ ] Implementar rate limiting
- [ ] Configurar monitoreo y alertas
