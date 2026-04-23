# 🎓 Sistema de Control de Asistencia Empresarial

> Proyecto full-stack guiado por el docente — Programación Web 2026A

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Estado Actual](#-estado-actual)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Casos de Uso](#-casos-de-uso)
- [Plan de Releases](#-plan-de-releases)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
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
| Pérdida y deterioro de información | Base de datos centralizada PostgreSQL |
| Sin control real de tardanzas | Detección automática con tolerancia configurable |
| Dificultad para consolidar datos | Listados y reportes por empleado y departamento |
| Cálculo manual de horas | Cálculo automático de horas trabajadas por jornada |

### Alcance

| Aspecto | Detalle |
|---|---|
| **Tipo** | Proyecto académico demostrativo — Guiado por el Docente |
| **Empresa objetivo** | ~200 empleados distribuidos en departamentos |
| **Entidades** | 7 entidades con relaciones (ver modelo de datos) |
| **Casos de Uso** | 8 CUs principales |
| **Historias de Usuario** | 10 HUs organizadas en 5 sprints |
| **Releases** | 2 releases alineados con los cortes académicos |

### Funcionalidades Principales

- ✅ CRUD completo de Empleados, Departamentos y Horarios Laborales
- ✅ Autenticación con JWT (login, logout, control de acceso por roles)
- ✅ Registro digital de entrada y salida con detección automática de tardanzas
- ✅ Cálculo automático de horas trabajadas por jornada
- ✅ Configuración de horarios laborales y días festivos
- ✅ Listado de registros de asistencia por empleado y por fecha
- ✅ Reporte de asistencia mensual por empleado (JSON / vista web)
- ✅ Common Module: filtros de excepción e interceptores de respuesta globales

---

## 🎯 Estado Actual

> **Última actualización:** Sprint 2 en curso

### Progreso por Sprint

| Sprint | Estado | HUs | Período |
|---|---|---|---|
| Sprint 1 — Infraestructura y entidades base | ✅ **Completado** | HU-01, HU-02, HU-03 | Mar 16 → Mar 29 |
| Sprint 2 — Asistencia y horarios | 🔄 **En progreso** | HU-04, HU-05 | Mar 30 → Abr 10 |
| Sprint 3 — Common Module y Frontend base | ⏳ Pendiente | HU-06, HU-07 | Abr 13 → Abr 17 |
| Sprint 4 — Frontend asistencia e integración | ⏳ Pendiente | HU-08, HU-09 | Abr 20 → May 8 |
| Sprint 5 — Reportes y cierre | ⏳ Pendiente | HU-10 | May 11 → May 22 |

### Hitos Completados ✅

#### Backend (NestJS + Prisma + PostgreSQL)
- Docker Compose con PostgreSQL, NestJS (puerto 3001) y Next.js (puerto 3000)
- Prisma schema con entidades base y migraciones ejecutadas
- Módulo `auth` — JWT login, logout y guard global con `@Public()` decorator
- Módulo `departamentos` — CRUD completo (Controller → Service → Repository)
- Módulo `empleados` — CRUD completo con relación a Departamento
- Módulo `horarios` — CRUD completo con validación de horarios y días laborables
- Estructura de módulos según arquitectura del docente: `controller/` `service/` `repository/` `dto/` `entities/`

#### Frontend (Next.js + TypeScript + Tailwind CSS)
- Estructura Next.js con App Router
- Página de Login consumiendo `/auth/login`
- Dashboard base con navegación por módulos
- Páginas CRUD de Departamentos (listado, crear, editar, eliminar)
- Páginas CRUD de Empleados (listado, crear con selector de departamento)

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Backend** | NestJS (Node.js + TypeScript) | API REST con arquitectura en capas |
| **Frontend** | Next.js 14+ (React + TypeScript) | Interfaz de usuario con App Router |
| **Base de Datos** | PostgreSQL 16 | Almacenamiento relacional principal |
| **ORM** | Prisma | Modelado, migraciones y queries tipados |
| **Contenedores** | Docker + Docker Compose | Orquestación de servicios |
| **Autenticación** | JWT + Passport | Control de acceso por roles |
| **Validación** | class-validator + class-transformer | DTOs y validación de entrada |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura en capas** con separación de responsabilidades:

```
Cliente HTTP
    ↓
Frontend (Next.js — puerto 3000)
    ↓  peticiones HTTP con JWT
Backend API (NestJS — puerto 3001)
    ↓
Prisma ORM
    ↓
PostgreSQL (puerto 5432)
```

### Flujo de una Petición

```
Cliente → Controller (valida DTO) → JwtAuthGuard → Service (lógica de negocio) → Repository (Prisma) → PostgreSQL
```

### Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/       # @Public(), @CurrentUser()
│   │   │   ├── filters/          # HttpExceptionFilter global
│   │   │   ├── interceptors/     # TransformInterceptor
│   │   │   └── guards/           # JwtAuthGuard
│   │   ├── prisma/               # PrismaModule global (@Global)
│   │   └── modules/
│   │       ├── auth/             # JWT, login, logout
│   │       ├── empleados/        # CRUD empleados
│   │       ├── departamentos/    # CRUD departamentos
│   │       ├── horarios/         # Turnos y días festivos
│   │       ├── asistencia/       # Check-in / check-out
│   │       └── reportes/         # Listados y resúmenes
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── frontend/
│   ├── Dockerfile
│   └── src/
│       ├── app/                  # App Router (páginas)
│       ├── components/           # Componentes reutilizables
│       ├── services/             # Capa de acceso a la API
│       ├── interfaces/           # Tipos e interfaces TypeScript
│       └── lib/                  # Axios configurado con interceptores
│
└── README.md
```

### Módulos NestJS

| Módulo | Responsabilidad |
|---|---|
| `AuthModule` | JWT login/logout, JwtAuthGuard global, decorador @Public() |
| `DepartamentosModule` | CRUD departamentos con conteo de empleados |
| `EmpleadosModule` | CRUD empleados con relación a departamento |
| `HorariosModule` | CRUD turnos laborales y días festivos |
| `AsistenciaModule` | Registro entrada/salida, cálculo de tardanza y horas |
| `ReportesModule` | Listados de asistencia por empleado y por período |

---

## 📊 Modelo de Datos

### Relaciones Principales

```
Usuario       1 ──── 0..1  Empleado
Empleado      N ────   1   Departamento
Empleado      N ────   1   HorarioLaboral
Empleado      1 ──── N     RegistroAsistencia
DiaFestivo    (independiente — consultado en lógica de asistencia)
```

### Entidades

| Entidad | Campos Clave | Descripción |
|---|---|---|
| **Usuario** | id, email (unique), passwordHash, rol | Autenticación y control de acceso |
| **Empleado** | id, cedula (unique), nombres, apellidos, estado, deptoId, horarioId | Perfil laboral del empleado |
| **Departamento** | id, nombre (unique), activo | Estructura organizacional |
| **HorarioLaboral** | id, nombre, horaEntrada, horaSalida, toleranciaMin, diasLaborables (JSON) | Configuración de turnos |
| **RegistroAsistencia** | id, empleadoId, fecha, horaEntrada, horaSalida, minutosTarde, horasTrabajadas, estado | Registro diario — UNIQUE (empleadoId, fecha) |
| **DiaFestivo** | id, nombre, fecha, recurrente, paisRegion | Festivos colombianos por año |

### Enums

```typescript
Rol              → EMPLEADO | JEFE_DEPARTAMENTO | RRHH | ADMINISTRADOR
EstadoEmpleado   → ACTIVO | INACTIVO
EstadoAsistencia → PRESENTE | AUSENTE | TARDANZA | JUSTIFICADO | DIA_FESTIVO | FIN_DE_SEMANA
```

---

## 📋 Casos de Uso

| ID | Caso de Uso | Actores | Sprint |
|---|---|---|---|
| CU-01 | Registrar empleado con datos personales y departamento | RRHH, Admin | 1 |
| CU-02 | Gestionar departamentos de la empresa | Admin | 1 |
| CU-03 | Iniciar sesión y acceder según rol | Todos | 1 |
| CU-04 | Registrar marca de entrada con detección de tardanza automática | Empleado | 2 |
| CU-05 | Registrar marca de salida y calcular horas trabajadas | Empleado | 2 |
| CU-06 | Configurar horario laboral y días festivos | Admin | 2 |
| CU-07 | Consultar listado de registros de asistencia | RRHH, Jefe | 4 |
| CU-08 | Generar resumen de asistencia mensual por empleado | RRHH | 5 |

---

## 🚀 Plan de Releases

### Release 1 — Segundo Corte: Backend + Frontend Base

> **📅 Cierre: 17 de Abril de 2026** · Sprints 1, 2 y 3

**Objetivo:** API REST completa con arquitectura en capas y frontend con CRUD de entidades base y módulo de asistencia.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| Sprint 1 | Mar 16 → Mar 29 | HU-01, HU-02, HU-03 | Docker, Prisma, Empleados, Departamentos, Auth JWT |
| Sprint 2 | Mar 30 → Abr 10 | HU-04, HU-05 | Asistencia (check-in/out), horarios, festivos |
| Sprint 3 | Abr 13 → Abr 17 | HU-06, HU-07 | Common Module, Frontend base completo |

### Release 2 — Tercer Corte: Integración + Reportes

> **📅 Cierre: 22 de Mayo de 2026** · Sprints 4 y 5

**Objetivo:** Integración frontend ↔ backend completa, frontend de asistencia y reporte de asistencia mensual.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| Sprint 4 | Abr 20 → May 8 | HU-08, HU-09 | Frontend asistencia, listados, integración completa |
| Sprint 5 | May 11 → May 22 | HU-10 | Reporte mensual, smoke tests, cierre |

---

## 📌 Sprints e Historias de Usuario

### Sprint 1 — Infraestructura y entidades base ✅

> 📅 **Mar 16 → Mar 29** · 🚫 Festivo: Mar 23 (San José)

| # | Historia de Usuario | Tipo | Estado |
|---|---|---|---|
| HU-01 | Gestión de Empleados — CRUD completo con departamento | `backend` `frontend` | ✅ Completado |
| HU-02 | Gestión de Departamentos — CRUD completo | `backend` `frontend` | ✅ Completado |
| HU-03 | Autenticación JWT — login, logout y guard global | `backend` `seguridad` | ✅ Completado |

**Entregables:**
- ✅ Docker Compose con PostgreSQL, NestJS y Next.js
- ✅ Prisma schema con entidades Empleado, Departamento, HorarioLaboral y Usuario
- ✅ Migraciones ejecutadas
- ✅ CRUD completo (Controller → Service → Repository) con estructura del docente
- ✅ Auth JWT con `@Public()` decorator y `JwtAuthGuard` global
- ✅ Frontend: login, dashboard, listados y formularios de Empleados y Departamentos

---

### Sprint 2 — Asistencia y horarios 🔄

> 📅 **Mar 30 → Abr 10** · 🚫 Festivos: Abr 2-3 (Semana Santa)

| # | Historia de Usuario | Tipo | Estado |
|---|---|---|---|
| HU-04 | Registro de entrada y salida — check-in / check-out | `backend` | 🔄 En progreso |
| HU-05 | Configuración de horarios laborales y días festivos | `backend` | 🔄 En progreso |

**Entregables:**
- `POST /api/v1/asistencia/entrada` — registra horaEntrada, calcula si hay tardanza y cuántos minutos
- `POST /api/v1/asistencia/salida` — registra horaSalida, calcula horasTrabajadas
- `GET /api/v1/asistencia` — listado filtrable por empleadoId y fecha
- CRUD completo de `HorarioLaboral` (nombre, entrada, salida, toleranciaMin, diasLaborables)
- CRUD completo de `DiaFestivo` con seed de festivos Colombia 2026
- Constraint `UNIQUE (empleadoId, fecha)` garantiza un registro por día por empleado

---

### Sprint 3 — Common Module y Frontend base

> 📅 **Abr 13 → Abr 17** · 📝 Cierre Segundo Corte: 17 Abr

| # | Historia de Usuario | Tipo | Estado |
|---|---|---|---|
| HU-06 | Common Module — Filters, Interceptors y Pipes globales | `cross-cutting` | ⏳ Pendiente |
| HU-07 | Frontend base — Horarios, navegación y layout general | `frontend` | ⏳ Pendiente |

**Entregables:**
- `HttpExceptionFilter` global — respuestas de error uniformes `{ success: false, statusCode, message }`
- `TransformInterceptor` global — respuestas exitosas uniformes `{ success: true, data, timestamp }`
- `ValidationPipe` global con `whitelist: true` y `transform: true`
- Frontend: página de Horarios Laborales con CRUD
- Frontend: layout general con sidebar y navegación entre módulos
- Frontend: manejo de estados loading / error / éxito en todas las páginas

---

### Sprint 4 — Frontend asistencia e integración

> 📅 **Abr 20 → May 8** · 🚫 Festivo: May 1 (Día del Trabajo)

| # | Historia de Usuario | Tipo | Estado |
|---|---|---|---|
| HU-08 | Frontend — Vista de fichaje (check-in / check-out) | `frontend` | ⏳ Pendiente |
| HU-09 | Frontend — Listado de registros de asistencia | `frontend` | ⏳ Pendiente |

**Entregables:**
- Página de fichaje: botón de entrada/salida con feedback visual (tardanza, horas trabajadas)
- Tabla de registros de asistencia filtrable por empleado y fecha
- Badge de estado por registro: PRESENTE (verde), TARDANZA (amarillo), AUSENTE (rojo)
- Integración completa frontend ↔ backend verificada con datos reales
- Diseño responsivo (desktop + tablet)
- Componentes de feedback: mensajes de éxito y error

---

### Sprint 5 — Reporte de asistencia y cierre

> 📅 **May 11 → May 22** · 🚫 Festivo: May 18 (Ascensión) · 📝 Cierre Tercer Corte: 22 May

| # | Historia de Usuario | Tipo | Estado |
|---|---|---|---|
| HU-10 | Reporte de asistencia mensual por empleado | `backend` `frontend` | ⏳ Pendiente |

**Entregables:**
- `GET /api/v1/reportes/empleado/:id?mes=YYYY-MM` — retorna resumen del mes:
  - Días presentes, días con tardanza, días ausentes
  - Total horas trabajadas, total minutos de tardanza
  - Detalle día a día con estado
- Frontend: selector de empleado + mes con tabla del resumen
- Smoke tests de todos los módulos con Thunder Client
- `docker compose up` funciona desde cero en máquina limpia
- README actualizado con el estado final del proyecto

---

## 📅 Cronograma

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              SEGUNDO CORTE (Release 1) — Cierre: 17 Abr 2026              │
│                        Backend + Frontend Base                              │
├─────────────────┬──────────────────────┬───────────────────────────────────┤
│   Sprint 1      │      Sprint 2        │          Sprint 3                  │
│  Mar 16 → 29    │   Mar 30 → Abr 10   │       Abr 13 → 17                  │
│  ✅ Completado  │   🔄 En progreso     │       ⏳ Pendiente                 │
│                 │                      │                                    │
│ • Docker+Prisma │ • Check-in/out       │ • Common Module                    │
│ • Empleados     │ • Cálculo tardanza   │ • HttpExceptionFilter              │
│ • Departamentos │ • Horas trabajadas   │ • TransformInterceptor             │
│ • Auth JWT      │ • Horarios y festivos│ • Frontend Horarios                │
│ • Frontend base │                      │ • Layout y navegación              │
│                 │                      │                                    │
│ 🚫 Mar 23      │ 🚫 Abr 2-3          │                                    │
│   (San José)    │   (Semana Santa)     │                                    │
├─────────────────┴──────────────────────┴───────────────────────────────────┤
│              TERCER CORTE (Release 2) — Cierre: 22 May 2026               │
│                        Integración + Reportes                               │
├──────────────────────────────────────┬─────────────────────────────────────┤
│          Sprint 4                    │            Sprint 5                  │
│         Abr 20 → May 8              │          May 11 → 22                 │
│         ⏳ Pendiente                 │          ⏳ Pendiente                │
│                                      │                                      │
│ • Frontend fichaje                   │ • Reporte mensual por empleado       │
│ • Vista check-in/check-out           │ • Resumen: presentes, tardanzas      │
│ • Listado registros asistencia       │ • Smoke tests todos los módulos      │
│ • Integración frontend ↔ backend     │ • Validación docker compose up       │
│ • Responsive + feedback visual       │ • Cierre y documentación final       │
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
- [ ] Endpoint probado manualmente con Thunder Client

### Frontend
- [ ] Página(s) implementada(s) con componentes reutilizables
- [ ] Consumo del API a través de la capa `services/`
- [ ] Manejo de estados: carga (loading), éxito y error
- [ ] Formularios con validación del lado del cliente
- [ ] Diseño responsivo y navegable

### Infraestructura y Código
- [ ] Código versionado en GitHub con commits descriptivos
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
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=asistencia_db

JWT_SECRET=cambia_esto_por_un_secreto_seguro_32chars

NODE_ENV=development
PORT=3001
```

### Levantar los servicios

```bash
docker compose up -d
```

### Ejecutar migraciones

```bash
docker compose exec backend sh
npx prisma migrate dev
```

### Acceder a los servicios

| Servicio | URL |
|---|---|
| **Frontend (Next.js)** | [http://localhost:3000](http://localhost:3000) |
| **Backend (NestJS API)** | [http://localhost:3001/api/v1](http://localhost:3001/api/v1) |
| **Prisma Studio** | [http://localhost:5555](http://localhost:5555) |
| **PostgreSQL** | `localhost:5432` |

---

## 📡 Endpoints Principales

```
# Auth (públicos)
POST   /api/v1/auth/login           → Iniciar sesión → { accessToken, usuario }
POST   /api/v1/auth/register        → Registrar usuario
GET    /api/v1/auth/me              → Perfil del usuario autenticado (requiere token)

# Departamentos
GET    /api/v1/departamentos        → Listado con conteo de empleados
POST   /api/v1/departamentos        → Crear departamento
PATCH  /api/v1/departamentos/:id    → Actualizar
DELETE /api/v1/departamentos/:id    → Soft-delete (activo = false)

# Empleados
GET    /api/v1/empleados            → Listado con departamento incluido
POST   /api/v1/empleados            → Crear empleado
PATCH  /api/v1/empleados/:id        → Actualizar
DELETE /api/v1/empleados/:id        → Soft-delete (estado = INACTIVO)

# Horarios
GET    /api/v1/horarios             → Listado de turnos
POST   /api/v1/horarios             → Crear turno
PATCH  /api/v1/horarios/:id         → Actualizar

# Asistencia
POST   /api/v1/asistencia/entrada   → Check-in (calcula tardanza automáticamente)
POST   /api/v1/asistencia/salida    → Check-out (calcula horas trabajadas)
GET    /api/v1/asistencia           → Listado filtrable por empleadoId y fecha

# Reportes
GET    /api/v1/reportes/empleado/:id?mes=YYYY-MM → Resumen mensual de asistencia
```

---

<p align="center">
  <strong>Programación Web — Ingeniería de Sistemas — 2026A</strong><br>
  <em>Corporación Universitaria del Huila — CORHUILA</em>
</p>