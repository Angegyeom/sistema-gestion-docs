# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for **CPV 2025** (Census Population and Housing system) built for INEI (Peru's National Institute of Statistics). It's a centralized management system for the 2025 census that provides access to various census applications across different operational phases (preparation, execution, and post-census).

The app uses Firebase for authentication, Firestore for data, and Google Cloud Storage for document management. It includes Genkit AI integration for AI-powered features. The application is in Spanish and features a role-based permission system.

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

### Authentication & Authorization Flow

1. **Login Flow**: Root (`/`) redirects to `/login` → Firebase Auth with email/password → redirect to `/aplicativos`
2. **User Creation**: User documents auto-created in Firestore (`users` collection) if they don't exist
3. **Role System**:
   - Users have a `roles` array field (also supports legacy `role` string for backwards compatibility)
   - Available roles: `ADMIN`, `SEGMENTACION`, `RECLUTAMIENTO`, `CAPACITACION`, `LOGISTICA`, `CAPDATOS-APK`, `CENSO-LINEA`, `CONSISTENCIA`, `MONITOREO`, `YANAPAQ`
   - Admins can edit all categories; other roles can only edit their specific category
4. **User Management**: API routes in `/api/auth/` for creating/deleting users (uses Firebase Admin SDK)

### Firebase Integration

Firebase initialization uses a dual approach:
- **Production**: Firebase App Hosting environment variables
- **Development**: Hardcoded config from `firebase/config.ts`

**Provider Architecture** (`src/firebase/provider.tsx`):
- `FirebaseClientProvider` wraps the app in `layout.tsx`
- Provides Firebase services and user auth state via React Context
- Manages auth state listener (`onAuthStateChanged`)

**Available Hooks**:
- `useAuth()` - Firebase Auth instance
- `useFirestore()` - Firestore instance
- `useFirebaseApp()` - Firebase App instance
- `useUser()` - Current user + Firestore user document data (includes `userData`, `isUserDataLoading`)
- `useDoc(collection, docId)` - Subscribe to a single document
- `useCollection(collection)` - Subscribe to a collection
- `usePermissions()` - User permissions (roles, `canEditCategory()`, `isAdmin`, `hasRole()`)

### Application Pages

**Aplicativos** (`/aplicativos`): Main dashboard with census system cards grouped by operational phase. Cards open modals with embedded iframes to external systems.

**Documentacion** (`/documentacion`): Document management with role-based editing permissions. Lists documents from Firestore organized by categories that map to user roles.

**Administrador** (`/administrador`): User management interface for admins to create/delete users and assign roles.

**Presentaciones** (`/presentaciones`): Presentations viewer page.

### Document Management System

**Storage Architecture**:
- **Files**: Private by default in Google Cloud Storage bucket `mi-app-archivos-cpv`
- **Metadata**: Stored in Firestore (`documents` collection likely)
- **Access**: Signed URLs with configurable expiration (default: 60 minutes)

**API Routes** (`/api/storage/`):
- `POST /api/storage/upload` - Upload files (with filename sanitization)
- `GET /api/storage/download?filePath=<path>&expiresIn=<minutes>` - Generate signed URLs
- `DELETE /api/storage/delete` - Delete a file
- `POST /api/storage/create-folder` - Create folder (creates `.placeholder` file)
- `DELETE /api/storage/delete-folder` - Delete entire folder with all files

**Storage Utilities** (`src/lib/storage.ts`):
- `uploadFile(file, category, fileName?)` - Upload with auto-sanitization
- `getFileUrl(filePath, expiresInMinutes?)` - Generate signed URL
- `deleteFile(filePath)` - Delete file
- `createFolder(folderName)` - Create folder
- `deleteFolder(folderName)` - Delete folder recursively
- `listFiles(category?)` - List files in category
- `fileExists(filePath)` - Check file existence
- `getFileMetadata(filePath)` - Get file metadata

**Folder Organization**: Matches role categories (segmentacion, reclutamiento, capacitacion, logistica, capdatos-apk, censo-linea, consistencia, monitoreo, yanapaq)

### Environment Variables

Required environment variables (see `.env.example`):
- `GEMINI_API_KEY` - Google Gemini API key for Genkit AI features
- `GCP_PROJECT_ID` - Google Cloud Platform project ID
- `GCP_CLIENT_EMAIL` - Service account email for GCS/Firebase Admin
- `GCP_PRIVATE_KEY` - Service account private key (newlines escaped as `\n`)
- `GCP_BUCKET_NAME` - Google Cloud Storage bucket name (default: `mi-app-archivos-cpv`)

**Note**: The same GCP credentials are used for both Google Cloud Storage and Firebase Admin SDK (user management APIs).

### Build Configuration

The Next.js config has:
- TypeScript and ESLint errors ignored during builds (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`)
- Image domains whitelisted: `placehold.co`, `images.unsplash.com`, `picsum.photos`
- **Important**: Type errors should be addressed before production deployment

## Common Patterns

### Working with User Data and Permissions

```typescript
import { useUser, usePermissions } from '@/firebase';

// Get current user and their Firestore data
const { user, userData, isUserLoading, isUserDataLoading } = useUser();

// Check permissions
const { isAdmin, canEditCategory, hasRole, userRoles } = usePermissions();
if (canEditCategory('segmentacion')) { /* allow edit */ }
```

### Working with Firestore

```typescript
import { useDoc, useCollection } from '@/firebase/firestore';
import { useFirestore } from '@/firebase';

// Subscribe to a document
const { data, loading, error } = useDoc('users', userId);

// Subscribe to a collection
const { data: items } = useCollection('items');

// Direct Firestore access
const firestore = useFirestore();
```

### Working with Google Cloud Storage

```typescript
// In API routes (server-side only)
import { uploadFile, getFileUrl, deleteFile } from '@/lib/storage';

const result = await uploadFile(file, 'segmentacion');
const signedUrl = await getFileUrl(result.filePath, 60); // 60 min expiry
await deleteFile(result.filePath);
```

## Important Notes

- **Language**: Application is in Spanish (`lang="es"`)
- **SSL in Development**: `/api/auth/create-user` disables SSL verification in development mode (`NODE_TLS_REJECT_UNAUTHORIZED = '0'`)
- **Dual Role Support**: User documents support both `roles` array (preferred) and legacy `role` string
- **UI Components**: Follow shadcn/ui pattern with Radix UI primitives in `src/components/ui/`
- **Background Color**: Uses `bg-[#004272]` (dark blue) instead of the purple gradient mentioned in `docs/blueprint.md`
- Uses `patch-package` for dependency modifications

## Known Issues & Technical Debt

### Critical Security Issues

1. **Missing Authentication on Storage API Routes** - Routes in `/api/storage/` (upload, download, delete, create-folder, delete-folder) lack authentication checks. Any unauthenticated user can upload/delete files.

2. **SSL Certificate Verification Disabled** - Auth API routes (`/api/auth/create-user`, `/api/auth/delete-user`, `/api/auth/update-password`) disable SSL verification in development with `NODE_TLS_REJECT_UNAUTHORIZED = '0'`. Ensure this never reaches production.

3. **File Path Traversal Risk** - `/api/storage/download` doesn't validate that `filePath` stays within expected category folders. Attacker could potentially use path traversal.

4. **Hardcoded GCP Fallback Credentials** - `src/lib/storage.ts` has hardcoded fallback values for `GCP_PROJECT_ID` and `GCP_BUCKET_NAME`.

### Data Consistency Issues

1. **Inconsistent Role Schema** - Login page creates users with `role` string field, but admin page uses `roles` array. The system handles both for backwards compatibility, but new code should only use `roles` array.

2. **Race Condition in useUser Hook** - Dynamic import inside useEffect in `src/firebase/provider.tsx` can cause race conditions with rapid user changes.

### Incomplete Features

1. **PasswordResetModal Not Implemented** - Component exists but is never rendered. The `showPasswordResetModal` state is declared but never set to true, and `requirePasswordReset` flag is never checked.

### Code Quality

1. **Excessive `any` Types** - Multiple files use `any` type defeating TypeScript checking: `provider.tsx`, `administrador/page.tsx`, `login/page.tsx`, `documentacion/page.tsx`, `PasswordResetModal.tsx`.

2. **Build Errors Ignored** - `next.config.ts` has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`. Type errors should be fixed before production deployment.

### Recommended Fixes (Priority Order)

1. Add Firebase Auth token verification to all `/api/storage/` routes
2. Implement file path validation (whitelist approach for categories)
3. Migrate all users to `roles` array, deprecate `role` string
4. Replace `any` types with proper TypeScript interfaces
5. Enable TypeScript error checking in builds
