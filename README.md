# 🎓 Sistema de Control de Asistencia Empresarial

Proyecto full-stack

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Casos de Uso](#-casos-de-uso)
- [Plan de Releases](#-plan-de-releases)
- [Cronograma](#-cronograma)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Instalación y Ejecución](#-instalación-y-ejecución)

---

## 📖 Descripción del Proyecto

El **Sistema de Control de Asistencia Empresarial** es una aplicación web full-stack diseñada para digitalizar y automatizar el registro de asistencia de una empresa mediana con aproximadamente 200 empleados distribuidos en varios departamentos.

### Problema que Resuelve

| Problema Actual | Solución Implementada |
|---|---|
| Planillas de asistencia en papel | Registro digital de entrada y salida |
| Pérdida y deterioro de información | Base de datos centralizada con respaldo |
| Dificultad para consolidar datos | Reportes automáticos por empleado, departamento y período |
| Cálculo manual de horas y nómina | Cálculo automático de horas trabajadas y horas extra |
| Sin control de tardanzas | Detección automática con tolerancia configurable |

### Alcance

| Aspecto | Detalle |
|---|---|
| **Tipo** | Proyecto académico demostrativo |
| **Empresa objetivo** | 200 empleados distribuidos en departamentos |
| **Entidades** | 10 entidades con relaciones |
| **Casos de Uso** | 10 CUs principales |
| **Historias de Usuario** | 16 HUs organizadas en 5 sprints |
| **Releases** | 2 releases alineados con los cortes académicos |

### Funcionalidades Principales

- ✅ Registro digital de entrada y salida con detección de tardanzas
- ✅ Cálculo automático de horas trabajadas por jornada
- ✅ Gestión de ausencias y justificaciones con soporte documental
- ✅ Solicitud y aprobación de horas extra con flujo multinivel
- ✅ Configuración de horarios laborales y días festivos
- ✅ Reportes por empleado, departamento y período (PDF y Excel)
- ✅ Dashboard en tiempo real para RRHH
- ✅ Notificaciones in-app

---
## 📌 Sprints e Historias de Usuario

### Sprint 1 — Infraestructura y entidades base

> 📅 **Mar 16 → Mar 29** · 🚫 Festivo: Mar 23 (San José)

| # | Historia de Usuario | Tipo | Prioridad |
|---|---|---|---|
| HU-01 | Gestión de Empleados (CRUD completo con cargo y departamento) | `backend` `frontend` | Alta |
| HU-02 | Gestión de Departamentos y asignación de jefe | `backend` `frontend` | Alta |
| HU-03 | Autenticación y control de acceso por roles (JWT) | `backend` `seguridad` | Alta |

**Entregables:**
- Docker Compose con PostgreSQL, NestJS, Next.js y Redis
- Prisma schema con entidades Empleado, Departamento, Cargo y Usuario
- Migraciones ejecutadas y seed de datos iniciales
- CRUD completo (Controller → Service → Repository) para las 3 entidades
- Módulo de autenticación con JWT (login, refresh, logout)
- Frontend: listados y formularios básicos con manejo de errores

---

### Sprint 2 — Asistencia y horarios

> 📅 **Mar 30 → Abr 10** · 🚫 Festivos: Abr 2-3 (Semana Santa)

| # | Historia de Usuario | Tipo | Prioridad |
|---|---|---|---|
| HU-04 | Registro de entrada y salida (check-in / check-out) | `backend` | Alta |
| HU-05 | Detección automática de tardanzas por horario | `backend` | Alta |
| HU-06 | Configuración de horarios laborales y días festivos | `backend` `frontend` | Media |

**Entregables:**
- Endpoint `POST /asistencia/entrada` con cálculo automático de tardanza
- Endpoint `POST /asistencia/salida` con cálculo de horas trabajadas
- Cron job de marcación de ausentes (23:59 lunes-viernes)
- CRUD de HorarioLaboral y DiaFestivo
- Lógica de tolerancia configurable por horario

---

### Sprint 3 — Justificaciones, Horas Extra y Frontend base

> 📅 **Abr 13 → Abr 17** · 📝 Cierre Segundo Corte: Abr 17

| # | Historia de Usuario | Tipo | Prioridad |
|---|---|---|---|
| HU-07 | Registro y gestión de justificaciones de ausencia | `backend` | Alta |
| HU-08 | Flujo de aprobación de justificaciones (jefe/RRHH) | `backend` | Alta |
| HU-09 | Solicitud y aprobación de horas extra | `backend` | Alta |
| HU-10 | Sistema de notificaciones in-app | `backend` | Media |
| HU-11 | Common Module: Filters, Interceptors, Pipes globales | `cross-cutting` | Alta |

**Entregables:**
- Módulo de Justificaciones con subida de archivos (Multer)
- Flujo de aprobación con notificación automática
- Módulo de Horas Extra con generación automática al registrar salida
- Common Module global (filtros, interceptores, transformación de respuestas)
- Frontend: estructura Next.js, listados y formularios de todas las entidades

---

### Sprint 4 — Frontend avanzado e integración

> 📅 **Abr 20 → May 8** · 🚫 Festivo: May 1 (Día del Trabajo)

| # | Historia de Usuario | Tipo | Prioridad |
|---|---|---|---|
| HU-12 | Frontend: Flujo de fichaje (entrada/salida) y asistencia diaria | `frontend` | Alta |
| HU-13 | Frontend: Dashboard RRHH con resumen en tiempo real | `frontend` | Alta |

**Entregables:**
- Vista de fichaje con feedback visual (tardanza, tiempo trabajado)
- Tablas de aprobación de justificaciones y horas extra para jefes/RRHH
- Dashboard con estadísticas: empleados presentes, tardanzas, ausencias del día
- Layout general con sidebar y navegación por roles
- Diseño responsivo (desktop + tablet)
- Componentes de feedback (toast/alert de éxito/error)

---

### Sprint 5 — Reportes, cierres y despliegue

> 📅 **May 11 → May 22** · 🚫 Festivo: May 18 (Ascensión) · 📝 Cierre Tercer Corte: May 22

| # | Historia de Usuario | Tipo | Prioridad |
|---|---|---|---|
| HU-14 | Reporte mensual por empleado (PDF exportable) | `backend` `frontend` `reporte` | Alta |
| HU-15 | Reporte de asistencia por departamento | `backend` `frontend` `reporte` | Alta |
| HU-16 | Resumen de horas extra para nómina (Excel exportable) | `backend` `frontend` `reporte` | Media |

**Entregables:**
- Reporte PDF individual: horas trabajadas, tardanzas, ausencias, HE aprobadas
- Reporte de departamento con estadísticas consolidadas
- Exportación Excel con datos para procesamiento de nómina
- Pruebas de integración E2E
- Docker Compose validación final y documentación de despliegue

---
## 🛠 Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Backend** | NestJS (Node.js + TypeScript) | API REST con arquitectura en capas |
| **Frontend** | Next.js 14+ (React + TypeScript) | Interfaz de usuario con App Router |
| **Base de Datos** | PostgreSQL 16 | Almacenamiento relacional principal |
| **ORM** | Prisma | Modelado, migraciones y queries tipados |
| **Caché / Sesiones** | Redis 7 | JWT blacklist, rate limiting, cache de reportes |
| **Contenedores** | Docker + Docker Compose | Orquestación de servicios |
| **Validación** | class-validator + class-transformer | DTOs y validación de entrada |
| **Proxy inverso** | Nginx | SSL, routing y assets estáticos |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura en capas** con principios de Clean Architecture y separación de responsabilidades:

```
Cliente HTTP
    ↓
  Nginx (Puerto 80/443)
    ↓             ↓
Frontend       Backend API
(Next.js)      (NestJS)
               ↓       ↓
           Prisma     Redis
             ↓
         PostgreSQL
```

### Flujo de una Petición

```
Cliente → Controller (valida DTO) → Guard (JWT + Roles) → Service (lógica de negocio) → Repository (Prisma) → PostgreSQL
```

### Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── .env.example
├── nginx/
│   └── nginx.conf
│
├── backend/                        # API REST con NestJS
│   ├── Dockerfile
│   ├── src/
│   │   ├── common/                 # Módulo compartido (cross-cutting)
│   │   │   ├── decorators/         # @Roles(), @Public(), @CurrentUser()
│   │   │   ├── filters/            # HttpExceptionFilter global
│   │   │   ├── interceptors/       # TransformInterceptor, LoggingInterceptor
│   │   │   ├── pipes/              # UuidValidationPipe
│   │   │   └── guards/             # JwtAuthGuard, RolesGuard
│   │   ├── prisma/                 # PrismaModule global (@Global)
│   │   └── modules/
│   │       ├── auth/               # JWT, login, refresh token
│   │       ├── empleados/          # CRUD empleados
│   │       ├── departamentos/      # Jerarquía organizacional
│   │       ├── asistencia/         # Check-in/out, cálculo de horas
│   │       ├── horas-extra/        # Solicitudes y aprobaciones
│   │       ├── justificaciones/    # Ausencias y soportes
│   │       ├── horarios/           # Turnos y días festivos
│   │       ├── reportes/           # PDF y Excel
│   │       └── notificaciones/     # In-app y email
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── frontend/                       # Interfaz con Next.js
│   ├── Dockerfile
│   └── src/
│       ├── app/                    # App Router (páginas)
│       ├── components/             # Componentes reutilizables
│       ├── services/               # Capa de acceso a la API
│       ├── interfaces/             # Tipos e interfaces TypeScript
│       └── lib/                    # Utilidades y helpers
│
└── README.md
```

### Módulos NestJS

| Módulo | Responsabilidad | Rol que accede |
|---|---|---|
| `AuthModule` | JWT, login, refresh, logout | Todos |
| `EmpleadosModule` | CRUD de empleados y cargos | RRHH, Admin |
| `DepartamentosModule` | Gestión de departamentos y jefes | Admin |
| `AsistenciaModule` | Registro entrada/salida, cálculo de horas | Todos |
| `HorasExtraModule` | Solicitudes y flujo de aprobación | Empleado, Jefe, RRHH |
| `JustificacionesModule` | Ausencias y soportes documentales | Empleado, Jefe, RRHH |
| `HorariosModule` | Turnos laborales y días festivos | Admin |
| `ReportesModule` | Generación PDF y Excel para nómina | RRHH, Jefe, Admin |
| `NotificacionesModule` | Alertas in-app y correo electrónico | Todos |

---

## 📊 Modelo de Datos

### Relaciones Principales

```
Usuario           1 ──── 0..1  Empleado
Empleado          N ────   1   Departamento
Empleado          N ────   1   Cargo
Empleado          N ────   1   HorarioLaboral
Empleado          1 ──── N     RegistroAsistencia
RegistroAsistencia 1 ── 0..1   JustificacionAusencia
Empleado          1 ──── N     HoraExtra
Empleado          1 ──── N     Notificacion
```

### Entidades

| Entidad | Campos Clave | Descripción |
|---|---|---|
| **Usuario** | id, email (unique), passwordHash, rol, tokenVersion | Autenticación y control de acceso |
| **Empleado** | id, cedula (unique), nombres, apellidos, estado, cargoId, deptoId, horarioId | Perfil laboral del empleado |
| **Departamento** | id, nombre (unique), jefeId, activo | Estructura organizacional |
| **Cargo** | id, nombre, departamentoId, activo | Posición en el organigrama |
| **HorarioLaboral** | id, nombre, horaEntrada, horaSalida, toleranciaMin, diasLaborables (JSON) | Configuración de turnos |
| **RegistroAsistencia** | id, empleadoId, fecha, horaEntrada, horaSalida, minutosTarde, horasTrabajadas, estado | Registro diario de asistencia |
| **JustificacionAusencia** | id, registroId, tipo, descripcion, urlSoporte, estadoAprobacion | Justificaciones con soporte documental |
| **HoraExtra** | id, empleadoId, fecha, horaInicio, horaFin, totalHoras, tipo, estado | Solicitudes y aprobación de HE |
| **DiaFestivo** | id, nombre, fecha, recurrente, paisRegion | Festivos por región/año |
| **Notificacion** | id, empleadoId, titulo, mensaje, tipo, leida | Alertas del sistema |

### Enums Clave

```typescript
Rol               → EMPLEADO | JEFE_DEPARTAMENTO | RRHH | ADMINISTRADOR
EstadoAsistencia  → PRESENTE | AUSENTE | TARDANZA | JUSTIFICADO | DIA_FESTIVO
TipoHoraExtra     → DIURNA | NOCTURNA | DOMINICAL_DIURNA | DOMINICAL_NOCTURNA
EstadoAprobacion  → PENDIENTE | APROBADO | RECHAZADO
TipoJustificacion → ENFERMEDAD | CITA_MEDICA | CALAMIDAD_DOMESTICA | PERMISO_PERSONAL | OTRO
```

---

## 📋 Casos de Uso

| ID | Caso de Uso | Actores | Sprint |
|---|---|---|---|
| CU-01 | Registrar empleado con datos personales, cargo y departamento | RRHH, Admin | 1 |
| CU-02 | Gestionar departamentos con jefe asignado | Admin | 1 |
| CU-03 | Registrar marca de entrada con detección de tardanza | Empleado | 2 |
| CU-04 | Registrar marca de salida y calcular horas trabajadas | Empleado | 2 |
| CU-05 | Configurar horario laboral y días festivos | Admin | 2 |
| CU-06 | Registrar justificación de ausencia con tipo y soporte | Empleado | 3 |
| CU-07 | Aprobar o rechazar justificación de ausencia | Jefe, RRHH | 3 |
| CU-08 | Solicitar y aprobar horas extra | Empleado, Jefe, RRHH | 3 |
| CU-09 | Consultar resumen semanal de asistencia | Todos | 4 |
| CU-10 | Generar reporte mensual por empleado y departamento | RRHH, Jefe | 5 |

---

## 🚀 Plan de Releases

### Release 1 — Segundo Corte: Backend + Frontend Base

> **📅 Cierre: 17 de Abril de 2026** · Sprints 1, 2 y 3

**Objetivo:** Entregar la API REST completa con arquitectura en capas y el frontend con las vistas de CRUD para todas las entidades base.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| Sprint 1 | Mar 16 → Mar 29 | HU-01, HU-02, HU-03 | Docker, Prisma, Empleados, Departamentos, Auth |
| Sprint 2 | Mar 30 → Abr 10 | HU-04, HU-05, HU-06 | Horarios, Festivos, Asistencia (entrada/salida) |
| Sprint 3 | Abr 13 → Abr 17 | HU-07 a HU-11 | Justificaciones, Horas Extra, Common Module, Frontend base |

### Release 2 — Tercer Corte: Integración + Reportes

> **📅 Cierre: 22 de Mayo de 2026** · Sprints 4 y 5

**Objetivo:** Integración completa frontend ↔ backend, flujos complejos (fichar → justificar → aprobar), reportes exportables y despliegue funcional con Docker.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| Sprint 4 | Abr 20 → May 8 | HU-12, HU-13 | Frontend avanzado, flujos de aprobación, dashboard RRHH |
| Sprint 5 | May 11 → May 22 | HU-14, HU-15, HU-16 | Reportes PDF/Excel, promedio horas, pruebas E2E |

---

## 📅 Cronograma

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              SEGUNDO CORTE (Release 1) — Cierre: 17 Abr 2026              │
│                        Backend + Frontend Base                              │
├─────────────────┬──────────────────────┬───────────────────────────────────┤
│   Sprint 1      │      Sprint 2        │          Sprint 3                  │
│  Mar 16 → 29    │   Mar 30 → Abr 10   │       Abr 13 → 17                  │
│                 │                      │                                    │
│ • Docker+Redis  │ • Registro entrada   │ • Justificaciones                  │
│ • Empleados     │ • Registro salida    │ • Horas extra                      │
│ • Departamentos │ • Tardanzas auto     │ • Common Module                    │
│ • Auth JWT      │ • Horarios/Festivos  │ • Frontend base                    │
│                 │                      │                                    │
│ 🚫 Mar 23      │ 🚫 Abr 2-3          │                                    │
│   (San José)    │   (Semana Santa)     │                                    │
├─────────────────┴──────────────────────┴───────────────────────────────────┤
│              TERCER CORTE (Release 2) — Cierre: 22 May 2026               │
│                        Integración + Reportes                               │
├──────────────────────────────────────┬─────────────────────────────────────┤
│          Sprint 4                    │            Sprint 5                  │
│         Abr 20 → May 8              │          May 11 → 22                 │
│                                      │                                      │
│ • Frontend fichaje                   │ • Reportes PDF y Excel               │
│ • Dashboard RRHH                     │ • Resumen para nómina                │
│ • Flujos de aprobación               │ • Pruebas E2E                        │
│ • Notificaciones                     │ • Despliegue final                   │
│                                      │                                      │
│ 🚫 May 1 (Día del Trabajo)          │ 🚫 May 18 (Ascensión)               │
└──────────────────────────────────────┴─────────────────────────────────────┘
```

### Festivos Colombianos (Marzo — Mayo 2026)

| Fecha | Festivo | Sprint Afectado |
|---|---|---|
| Lunes 23 de Marzo | Día de San José | Sprint 1 |
| Jueves 2 de Abril | Jueves Santo | Sprint 2 |
| Viernes 3 de Abril | Viernes Santo | Sprint 2 |
| Viernes 1 de Mayo | Día del Trabajo | Sprint 4 |
| Lunes 18 de Mayo | Día de la Ascensión | Sprint 5 |

---

## ✅ Definition of Done (DoD)

Cada Historia de Usuario se considera **terminada** cuando cumple **todos** los siguientes criterios:

### Backend
- [ ] Endpoint(s) implementados con arquitectura en capas: Controller → Service → Repository
- [ ] DTOs con validaciones usando `class-validator` y `class-transformer`
- [ ] Manejo de errores con excepciones HTTP apropiadas (`NotFoundException`, `ConflictException`, `BadRequestException`)
- [ ] Respuestas con formato uniforme a través del `TransformInterceptor`
- [ ] Endpoint probado manualmente con Postman / Thunder Client

### Frontend
- [ ] Página(s) implementada(s) con componentes reutilizables
- [ ] Consumo del API a través de la capa `services/`
- [ ] Manejo de estados: carga (loading), éxito y error
- [ ] Formularios con validación del lado del cliente
- [ ] Diseño responsivo y navegable

### Infraestructura y Código
- [ ] Código versionado en GitHub con commits descriptivos siguiendo Conventional Commits
- [ ] El servicio funciona correctamente con `docker compose up`
- [ ] No hay errores de consola ni advertencias críticas
- [ ] Las migraciones de Prisma están aplicadas y el schema es consistente

---

## ⚙ Instalación y Ejecución

### Prerrequisitos

- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados
- [Git](https://git-scm.com/downloads)

### Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/sistema-asistencia-empresarial.git
cd sistema-asistencia-empresarial
```

### Configurar variables de entorno

```bash
cp .env.example .env
```

```env
# .env.example

# Base de datos
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=asistencia_db

# JWT (mínimo 32 caracteres)
JWT_SECRET=cambia_esto_por_un_secreto_seguro_32chars
JWT_REFRESH_SECRET=cambia_esto_por_otro_secreto_seguro

# Redis
REDIS_URL=redis://redis:6379

# App
NODE_ENV=development
PORT=3001
```

### Levantar los servicios

```bash
# Levantar todos los servicios
docker compose up

# O en modo detached
docker compose up -d
```

### Ejecutar migraciones

```bash
# Entrar al contenedor del backend
docker compose exec backend sh

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Ver la BD en Prisma Studio
npx prisma studio
```

### Acceder a los servicios

| Servicio | URL |
|---|---|
| **Frontend (Next.js)** | [http://localhost:3000](http://localhost:3000) |
| **Backend (NestJS API)** | [http://localhost:3001/api/v1](http://localhost:3001/api/v1) |
| **Prisma Studio** | [http://localhost:5555](http://localhost:5555) |
| **PostgreSQL** | `localhost:5432` |
| **Redis** | `localhost:6379` |

---

## 📡 Endpoints Principales

```
POST   /api/v1/auth/login           → Iniciar sesión
POST   /api/v1/auth/logout          → Cerrar sesión
GET    /api/v1/auth/me              → Perfil del usuario autenticado

GET    /api/v1/empleados            → Listado paginado de empleados
POST   /api/v1/empleados            → Crear empleado
PATCH  /api/v1/empleados/:id        → Actualizar empleado

POST   /api/v1/asistencia/entrada   → Registrar entrada (calcula tardanza)
POST   /api/v1/asistencia/salida    → Registrar salida (calcula horas)
GET    /api/v1/asistencia/semana    → Resumen semanal del empleado autenticado

POST   /api/v1/justificaciones      → Crear justificación de ausencia
PATCH  /api/v1/justificaciones/:id/aprobar   → Aprobar justificación
PATCH  /api/v1/justificaciones/:id/rechazar  → Rechazar con motivo

POST   /api/v1/horas-extra          → Solicitar horas extra
PATCH  /api/v1/horas-extra/:id/aprobar       → Aprobar solicitud

GET    /api/v1/reportes/empleado/:id?mes=2025-04   → Reporte mensual PDF
GET    /api/v1/reportes/departamento/:id?mes=2025-04 → Reporte departamento
```

---

<p align="center">
  <strong>Programación Web — Ingeniería de Sistemas — 2026A</strong><br>
  <em>Corporación Universitaria del Huila — CORHUILA</em>
</p>