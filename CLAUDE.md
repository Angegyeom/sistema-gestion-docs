# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for **CPV 2025** (Census Population and Housing system) built for INEI (Peru's National Institute of Statistics). It's a management system for the 2025 census that provides a centralized dashboard to access various census applications across different phases (preparation, execution, and post-census).

The app uses Firebase for authentication and Google Cloud Storage for document storage. It includes Genkit AI integration for AI-powered features.

## Technology Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4 with custom animations
- **UI Components**: Radix UI (shadcn/ui style)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Google Cloud Storage (@google-cloud/storage)
- **AI Integration**: Genkit AI (@genkit-ai/google-genai, @genkit-ai/next)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
NODE_ENV=production npm run build

# Start production server
npm start

# Lint check
npm run lint

# Type checking
npm run typecheck

# Genkit AI development (two modes)
npm run genkit:dev    # Start Genkit development server
npm run genkit:watch  # Start with auto-reload on changes
```

The development server runs on `http://localhost:3000` by default.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API Routes
│   │   └── storage/        # Google Cloud Storage APIs
│   │       ├── upload/     # Upload files to GCS
│   │       └── download/   # Generate signed URLs for downloads
│   ├── layout.tsx          # Root layout with Firebase provider
│   ├── page.tsx            # Root redirects to /login
│   ├── login/              # Authentication page
│   ├── aplicativos/        # Main dashboard with census applications
│   ├── documentacion/      # Document management (file server)
│   ├── presentaciones/     # Presentations viewer
│   └── monitoreo/          # Monitoring dashboard
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── layout/             # Layout components (AppHeader)
│   └── FirebaseErrorListener.tsx
├── firebase/               # Firebase setup and utilities
│   ├── config.ts           # Firebase configuration
│   ├── index.ts            # Firebase initialization
│   ├── provider.tsx        # Firebase context provider
│   ├── client-provider.tsx # Client-side Firebase wrapper
│   ├── errors.ts           # Error handling
│   ├── error-emitter.ts    # Error event emitter
│   └── firestore/          # Firestore hooks
│       ├── use-doc.tsx     # Hook for single document
│       └── use-collection.tsx # Hook for collections
├── hooks/                  # Custom React hooks
├── lib/
│   ├── utils.ts            # Utility functions (cn, etc.)
│   └── storage.ts          # Google Cloud Storage utility functions
└── ai/                     # Genkit AI configuration (if exists)
```

## Architecture Notes

### Authentication Flow

1. Root page (`/`) redirects to `/login`
2. Login page uses Firebase Auth with email/password
3. After login, user is redirected to `/aplicativos`
4. User documents are automatically created in Firestore if they don't exist
5. Default roles: `admin@inei.gob.pe` gets "admin" role, others get "consulta"

### Firebase Integration

Firebase is initialized client-side with a dual approach:
- First tries to initialize via Firebase App Hosting environment variables (for production)
- Falls back to hardcoded config from `firebase/config.ts` (for development)

The `FirebaseClientProvider` wraps the entire app in `layout.tsx` and provides Firebase services via React Context. Use these hooks to access Firebase:
- `useAuth()` - Get Firebase Auth instance
- `useFirestore()` - Get Firestore instance
- `useDoc()` - Subscribe to a Firestore document
- `useCollection()` - Subscribe to a Firestore collection

### Application Pages

**Aplicativos Page** (`/aplicativos`): Main dashboard displaying census systems grouped by phase:
1. Preparation Phase: Segmentation, HR, Logistics, Training
2. Execution Phase: Field Operations, Data Processing
3. Post-Census Phase: Post-Census Survey

Each system card opens a modal with an embedded iframe to access the external system. Some systems include stored credentials.

**Documentacion Page** (`/documentacion`): Document management system that uses Google Cloud Storage:
- Lists documents from Firestore organized by categories (segmentacion, rrhh, logistica, etc.)
- Supports file upload, download, and preview (PDFs shown inline)
- Auto-detects document type from filename
- Files stored in GCS bucket: `mi-app-archivos-cpv`

### Document Management System

The documentation system uses Google Cloud Storage for file storage and Firestore for metadata:

**API Routes** (`/api/storage/`):
- `POST /api/storage/upload` - Upload files to Google Cloud Storage
- `GET /api/storage/download?filePath=<path>&expiresIn=<minutes>` - Generate signed URLs for downloads/previews

**GCS Bucket Structure**:
```
mi-app-archivos-cpv/
├── segmentacion/
├── rrhh/
├── logistica/
├── capacitacion/
├── operacion/
├── procesamiento/
├── postcensal/
└── generales/
```

**Key Features**:
- Automatic filename sanitization (removes accents, special chars)
- Version detection from filename (e.g., `_v1.0`)
- Files are private by default (signed URLs with configurable expiration)
- PDF preview in browser using signed URLs
- MIME type detection for various formats
- Firestore stores document metadata (title, category, type, version, filePath)
- Signed URLs expire after 60 minutes by default

### Environment Variables

Required environment variables (`.env`):
- `GEMINI_API_KEY` - Google Gemini API key for AI features
- `GCP_PROJECT_ID` - Google Cloud Platform project ID
- `GCP_CLIENT_EMAIL` - Service account email for GCS authentication
- `GCP_PRIVATE_KEY` - Service account private key for GCS authentication
- `GCP_BUCKET_NAME` - Google Cloud Storage bucket name (default: `mi-app-archivos-cpv`)

Note: See `.env.example` for the required format of these variables.

### Build Configuration

The Next.js config (`next.config.ts`) has:
- TypeScript and ESLint errors ignored during builds (temporarily for development)
- Image domains whitelisted: `placehold.co`, `images.unsplash.com`, `picsum.photos`

### Styling System

Tailwind is configured with:
- Custom HSL color system using CSS variables
- Custom animations: `accordion-down`, `accordion-up`, `progress`, `progressBar`
- Text shadow utilities: `text-shadow`, `text-shadow-md`, `text-shadow-lg`
- Custom fonts: Segoe UI (sans), Inter (body/headline), monospace (code)

The app uses a gradient background: `from-[#667eea] to-[#764ba2]` (purple gradient)

## Common Development Tasks

### Adding a New Page

1. Create page in `src/app/[route]/page.tsx`
2. Add route to navigation in `src/components/layout/app-header.tsx` (navItems array)
3. Import and use `<AppHeader />` component in your page

### Adding a New UI Component

UI components follow the shadcn/ui pattern. They're located in `src/components/ui/`. Use Radix UI primitives and style with Tailwind classes.

### Working with Firestore

```typescript
import { useDoc, useCollection } from '@/firebase';

// In component
const { data, loading, error } = useDoc('users', userId);
const { data: items } = useCollection('items');
```

### Running Type Checks

Always run type checking before committing:
```bash
npm run typecheck
```

Note: Build currently ignores TypeScript errors (`ignoreBuildErrors: true`), but this should be addressed before production.

## Known Issues

- TypeScript and ESLint errors are currently ignored during builds
- Some census system URLs are external and may have CORS issues when embedded
- The Genkit AI integration may require additional setup (check `src/ai/dev.ts` if it exists)

## Notes

- The app is in Spanish (language: 'es')
- Uses patch-package for dependency modifications
- Login page has default email pre-filled: `admin@inei.gob.pe`
- Public assets (logos) are in `public/images/`
- **Google Cloud Storage**: The document management system uses GCS for file storage. Files are private by default and accessed via signed URLs.
- GCS bucket name: `mi-app-archivos-cpv` (located in us-east1)
