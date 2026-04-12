# CEICAVS — Plataforma de Gestión Escolar

## Descripción

CEICAVS es una plataforma de gestión escolar diseñada para el Centro Escolar CEICAVS. Centraliza la gestión de usuarios, la toma de asistencia, el blog institucional, herramientas educativas y transcripción de audio con inteligencia artificial. La interfaz está completamente en español, orientada al uso cotidiano de administradores, docentes y estudiantes.

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| Frontend | React 19 + Vite | SPA con renderizado en cliente |
| Estilos | Tailwind CSS v4 + shadcn/ui | Sistema de diseño accesible |
| Routing | React Router v7 (data mode) | Navegación con carga de datos |
| Estado del servidor | Apollo Client 4 + GraphQL | Queries y mutaciones tipadas |
| i18n | react-i18next | Internacionalización (español por defecto) |
| Backend | NestJS 10 + Apollo Server | API GraphQL code-first |
| Arquitectura backend | CQRS (CommandBus + QueryBus) | Separación de responsabilidades |
| Autenticación | Passport JWT | Tokens de acceso + refresco |
| Autorización | CASL (@casl/ability) | Permisos basados en rol |
| Base de datos | PostgreSQL + Prisma 7 + Kysely | ORM con queries tipadas |
| Almacenamiento | Cloudinary | Audio para transcripciones |
| Transcripción | Groq Whisper | Audio a texto con IA |
| Resúmenes | Google Gemini | Generación de resúmenes con IA |
| Despliegue frontend | Vercel | Hosting del SPA |
| Despliegue backend | Render | API NestJS |

## Arquitectura General

```
ceicavs/
├── apps/
│   ├── web/          # React SPA (Vite, Puerto 5173)
│   └── api/          # NestJS GraphQL API (Puerto 3001)
├── packages/
│   ├── shared/       # CASL + enums de autorización
│   ├── db/           # Prisma 7 + Kysely
│   └── ui/           # Componentes shadcn/ui compartidos
```

El backend es **code-first**: los decoradores `@ObjectType`, `@InputType` y `@Resolver` de NestJS generan automáticamente el schema GraphQL (`schema.gql`). El frontend usa **codegen** (`graphql-codegen`) para generar tipos TypeScript a partir del schema, garantizando tipos exactos en todas las queries y mutaciones.

La autorización se maneja con **CASL** como fuente única de verdad: `packages/shared` define los enums `Action`, `Subject` y `UserRole`, usados tanto en el backend (guards + handlers) como en el frontend (componente `<Can>` + `RequireAbility`).

## Roles de Usuario

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Administrador** | Gestión total de la plataforma | Todo: usuarios, grupos, asistencia, blog, herramientas, transcripciones |
| **Docente** | Gestión pedagógica | Grupos, asistencia, blog, herramientas, transcripciones (sin CRUD de usuarios) |
| **Estudiante** | Participación limitada | Ver asistencia propia, blog (con aprobación previa), herramientas (sin transcripciones) |

## Integraciones Externas

| Servicio | Propósito | Usado en |
|----------|-----------|----------|
| **Cloudinary** | Almacenamiento de archivos de audio | Transcripciones (`Recording.audioUrl`) |
| **Groq Whisper** | Transcripción de audio a texto | `/transcription/new` → `Transcription.fullTranscript` |
| **Google Gemini** | Generación de resúmenes con IA | `/transcription/:id` → `Transcription.summary` |
| **YouTube API** (yt-dlp) | Metadata y descarga de videos | Herramienta `/tools/youtube-downloader` |

## Flujo de Autenticación

1. El usuario envía correo y contraseña al endpoint GraphQL `login`
2. El servidor verifica las credenciales y devuelve `accessToken` + `refreshToken`
3. El frontend almacena los tokens en `localStorage`
4. Apollo Client adjunta el `accessToken` en el header `Authorization: Bearer <token>` en cada request
5. `AppBootstrap` rehidrata el contexto de autenticación al recargar la página
6. `AbilityProvider` construye el objeto CASL de permisos basado en el rol del usuario
7. Las rutas protegidas verifican autenticación y redirigen a `/login` si no hay sesión

## Modelo de Permisos (CASL)

```
Admin:   todo lo que puede Teacher + CRUD usuarios + estadísticas globales
Teacher: todo lo que puede Student + grupos + asistencia + revisión blog + transcripción
Student: ver propia asistencia + leer blog + enviar publicaciones (con aprobación) + herramientas
```
