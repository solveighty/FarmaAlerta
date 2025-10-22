# FarmaAlerta Backend API

Backend API para la aplicación FarmaAlerta - gestión de medicamentos, farmacias y disponibilidad en tiempo real.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación basado en JWT
- **Gestión de Usuarios**: Soporte para diferentes roles (pacientes, administradores de farmacia, administradores del sistema)
- **Base de Datos PostgreSQL**: Almacenamiento persistente con TypeORM
- **Caché con Redis**: Mejora de rendimiento con caching distribuido
- **API RESTful**: 38 endpoints bien documentados con Swagger/OpenAPI
- **Validación de Datos**: Validación automática con class-validator
- **Logging**: Sistema de logging con Winston
- **CORS**: Soporte para solicitudes cross-origin
- **Compresión**: Compresión de respuestas HTTP
- **Helmet**: Seguridad HTTP headers
- **Disponibilidad**: Gestión de medicamentos por farmacia
- **Búsqueda Global**: Búsqueda rápida con caché Redis
- **Sistema de Alertas**: Notificaciones de disponibilidad
- **Auditoría**: Registro de todas las acciones del sistema

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm o yarn
- PostgreSQL >= 12
- Redis >= 6.0 (opcional pero recomendado)

## ⚡ Quick Start

```bash
# 1. Clonar el repositorio
git clone [url-repositorio]
cd farmaalerta-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con configuraciones locales

# 4. Crear base de datos
createdb farmaalerta_db

# 5. Iniciar en modo desarrollo
npm run dev

# 6. Abrir Swagger
# Visita http://localhost:3000/api/docs
```

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
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRATION=7d

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=api/docs

# Logger
LOG_LEVEL=debug
```

### 4. Crear base de datos

```sql
CREATE DATABASE farmaalerta_db;
```

## 🚀 Uso

### Desarrollo

```bash
npm run dev
```

O con el comando alternativo:

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

Se utiliza **Swagger/OpenAPI 3.0** para documentar todos los endpoints con:
- Descripción de cada endpoint
- Ejemplos de solicitudes y respuestas
- Códigos de estado HTTP esperados
- Esquemas de entrada y salida
- Autenticación requerida (JWT)

### Resumen de Módulos (38 Endpoints)

### Endpoints Principales

#### Authentication (`/auth`)
- `POST /auth/register` - Registrar nuevo usuario o farmacia
- `POST /auth/login` - Iniciar sesión y obtener JWT
- `POST /auth/refresh` - Renovar el token JWT
- `GET /auth/profile` - Obtener perfil del usuario autenticado
- `POST /auth/logout` - Cerrar sesión

#### Users (`/users`)
- `GET /users` - Obtener todos los usuarios (paginado)
- `GET /users/:id` - Obtener usuario por ID
- `POST /users` - Crear nuevo usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### Medicines (`/medicines`)
- `GET /medicines` - Obtener todos los medicamentos (paginado)
- `GET /medicines/:id` - Obtener medicamento por ID
- `POST /medicines` - Crear medicamento
- `PATCH /medicines/:id` - Actualizar medicamento
- `DELETE /medicines/:id` - Eliminar medicamento
- `GET /medicines/search?q=query` - Buscar medicamentos por nombre o ingrediente genérico

#### Pharmacies (`/pharmacies`)
- `GET /pharmacies` - Obtener todas las farmacias (paginado)
- `GET /pharmacies/:id` - Obtener farmacia por ID
- `POST /pharmacies` - Crear farmacia
- `PATCH /pharmacies/:id` - Actualizar farmacia
- `DELETE /pharmacies/:id` - Eliminar farmacia
- `GET /pharmacies/search?q=query` - Buscar farmacias por nombre, ciudad o dirección

#### Disponibilidad (`/availability`)
- `GET /availability` - Listar todos los medicamentos con stock (admin)
- `GET /availability/pharmacy/:pharmacyId` - Ver stock de una farmacia específica
- `GET /availability/medicine/:medicineId` - Ver farmacias que tienen un medicamento
- `POST /availability` - Registrar disponibilidad de medicamento en farmacia
- `PATCH /availability/:id` - Actualizar stock y precio
- `DELETE /availability/:id` - Remover medicamento del stock

#### Search (`/search`)
- `GET /search?q=query` - Búsqueda global (farmacias + medicamentos) con caché Redis
- `GET /search/medicines?q=query` - Buscar solo medicamentos
- `GET /search/pharmacies?q=query` - Buscar solo farmacias
- `GET /search/nearby?lat=latitude&lon=longitude&radius=km` - Buscar farmacias cercanas (geolocalización)

#### Alerts (`/alerts`)
- `GET /alerts` - Obtener alertas del usuario autenticado
- `POST /alerts` - Crear alerta para disponibilidad de medicamento
- `DELETE /alerts/:id` - Eliminar alerta

#### Audit (`/audit`)
- `GET /audit` - Obtener registro de auditoría (admin)
- `GET /audit/user/:userId` - Ver acciones de un usuario específico
- `POST /audit` - Registrar acción en auditoría

## 📁 Estructura del Proyecto

```
src/
├── main.ts                        # Punto de entrada de la aplicación
├── app.module.ts                  # Módulo principal con todas las dependencias
├── app.service.ts                 # Servicios de la aplicación
├── app.controller.ts              # Controladores principales
│
├── config/                        # Configuraciones globales
│   ├── database.config.ts         # Configuración de TypeORM y PostgreSQL
│   ├── envs.interface.ts          # Interfaz tipada de variables de entorno
│   ├── envs.ts                    # Carga de variables de entorno
│   └── index.ts                   # Exportaciones de configuración
│
├── common/                        # Componentes comunes
│   ├── decorators/                # Decoradores personalizados
│   ├── filters/                   # Filtros de excepciones global
│   ├── interceptors/              # Interceptores (logging, transformación)
│   ├── pipes/                     # Pipes de validación
│   └── dtos/                      # DTOs genéricos (paginación)
│
├── modules/                       # Módulos de negocio (NestJS)
│   ├── auth/                      # Autenticación y JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                     # Gestión de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   ├── medicines/                 # CRUD de medicamentos
│   │   ├── medicines.controller.ts
│   │   ├── medicines.service.ts
│   │   ├── medicines.module.ts
│   │   ├── dto/
│   │   │   ├── create-medicine.dto.ts
│   │   │   └── update-medicine.dto.ts
│   │   └── entities/
│   │       └── medicine.entity.ts
│   │
│   ├── pharmacies/                # CRUD de farmacias
│   │   ├── pharmacies.controller.ts
│   │   ├── pharmacies.service.ts
│   │   ├── pharmacies.module.ts
│   │   ├── dto/
│   │   │   ├── create-pharmacy.dto.ts
│   │   │   └── update-pharmacy.dto.ts
│   │   └── entities/
│   │       └── pharmacy.entity.ts
│   │
│   ├── disponibilidad/            # Disponibilidad de medicamentos por farmacia
│   │   ├── disponibilidad.controller.ts
│   │   ├── disponibilidad.service.ts
│   │   ├── disponibilidad.module.ts
│   │   ├── dto/
│   │   │   ├── create-disponibilidad.dto.ts
│   │   │   └── update-disponibilidad.dto.ts
│   │   └── entities/
│   │       └── disponibilidad.entity.ts
│   │
│   ├── search/                    # Búsqueda global con Redis
│   │   ├── search.controller.ts
│   │   ├── search.service.ts
│   │   └── search.module.ts
│   │
│   ├── alerts/                    # Sistema de alertas
│   │   ├── alerts.controller.ts
│   │   ├── alerts.service.ts
│   │   ├── alerts.module.ts
│   │   └── entities/
│   │       └── alert.entity.ts
│   │
│   └── audit/                     # Auditoría del sistema
│       ├── audit.controller.ts
│       ├── audit.service.ts
│       ├── audit.module.ts
│       └── entities/
│           └── audit-log.entity.ts
│
├── redis/                         # Módulo Redis
│   └── redis.module.ts
│
└── logger/                        # Servicio de logging
    ├── logger.module.ts
    └── logger.service.ts

test/                             # Tests
└── (fixtures, e2e tests)
```

### Descripción de Carpetas

- **src/config/**: Centraliza todas las configuraciones (BD, env, etc)
- **src/common/**: Componentes reutilizables (decoradores, filtros, pipes)
- **src/modules/**: Módulos de negocio independientes con sus entidades, DTOs y servicios
- **src/redis/**: Integración con Redis para caché distribuido
- **src/logger/**: Sistema centralizado de logging

## 🔐 Seguridad

- Las contraseñas se hashean con bcrypt
- JWT para autenticación stateless
- Validación de entrada con class-validator
- CORS configurable
- Helmet para seguridad HTTP
- Rate limiting (a implementar)
- Input sanitization (a implementar)

## 👥 Roles y Permisos

### USER (Paciente)
- Ver medicamentos disponibles
- Buscar farmacias y medicamentos
- Ver disponibilidad en tiempo real
- Crear y gestionar alertas personales
- Ver su perfil

### PHARMACY (Administrador de Farmacia)
- Gestionar medicamentos de su farmacia
- Actualizar disponibilidad y precios
- Ver alertas relacionadas a su farmacia
- Ver historial de transacciones
- Ver su perfil y datos de farmacia

### ADMIN (Administrador del Sistema)
- Acceso completo a todas las operaciones
- Gestionar usuarios y farmacias
- Ver auditoría de todas las acciones
- Configurar parámetros del sistema
- Ver reportes y estadísticas

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

### Completado ✅
- [x] Estructura base del proyecto NestJS
- [x] Configuración de TypeScript y decoradores
- [x] Configuración de PostgreSQL con TypeORM
- [x] Configuración de Redis para caché
- [x] Módulos base: Auth, Users, Medicines, Pharmacies, Disponibilidad, Search, Alerts, Audit
- [x] Controladores con 38 endpoints documentados
- [x] Swagger/OpenAPI configurado en todos los endpoints
- [x] Modelos/Entidades sincronizadas con base de datos
- [x] DTOs con validación de clase-validator
- [x] Middleware: Helmet, CORS, Compresión

### En Progreso 🔄
- [ ] Implementación de lógica de negocio en servicios
- [ ] Autenticación JWT completa y Guards de seguridad
- [ ] Sistema de roles y permisos (USER, PHARMACY, ADMIN)
- [ ] Caché con Redis en endpoints de búsqueda
- [ ] Geolocalización para farmacias cercanas

### Por Hacer 📋
- [ ] Tests unitarios para servicios
- [ ] Tests de integración para controladores
- [ ] Rate limiting en endpoints públicos
- [ ] Validación y sanitización de inputs
- [ ] Logging completo con Winston
- [ ] Migraciones de base de datos
- [ ] Configurar CI/CD
- [ ] Monitoreo y alertas
- [ ] Documentación de API extendida

## 🔄 Próximos Pasos Recomendados

1. **Implementar Servicios**: Reemplazar los métodos descriptivos con lógica real
   ```typescript
   // En cada service, implementar CRUD completo
   // con validaciones y manejo de errores
   ```

2. **Configurar Guards de Seguridad**: Proteger endpoints con JWT
   ```typescript
   @UseGuards(JwtAuthGuard)
   @Get('profile')
   getProfile(@Request() req) { ... }
   ```

3. **Pruebas Locales**: Usar Postman/Insomnia para verificar endpoints
   - Base URL: `http://localhost:3000`
   - Headers: `Content-Type: application/json`, `Authorization: Bearer <token>`

4. **Implementar Migrations**: Versionar cambios en base de datos
   ```bash
   npm run typeorm migration:generate -- src/migrations/Initial
   npm run typeorm migration:run
   ```

5. **Agregar Tests**: Crear suites de pruebas
   ```bash
   npm run test
   npm run test:cov
   ```

## 📞 Soporte y Documentación

- **Issues**: Reportar bugs en [repositorio](https://github.com/solveighty/FarmaAlerta)
- **Swagger**: Documentación interactiva en `/api/docs`
- **Env Guide**: Ver `ENV_GUIDE.md` para detalle de variables
- **TypeORM**: [Documentación oficial](https://typeorm.io)
- **NestJS**: [Documentación oficial](https://docs.nestjs.com)
