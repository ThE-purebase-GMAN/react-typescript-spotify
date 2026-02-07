# Copilot Instructions

## Project Overview

- React 18 + TypeScript + Vite app integrating Spotify Web API and Web Playback SDK.
- API layer lives in `src/api`, UI in `src/components` and `src/pages`, auth in `src/context` and `src/api/auth`.
- Styling uses Tailwind CSS + DaisyUI utility classes.

## Architecture and Conventions

- Prefer TypeScript-first changes and reuse types from `src/data-objects/interface` and `src/data-objects/enum`.
- Follow existing file style (quotes, semicolons, spacing) in the file you touch.
- Use React function components with hooks; avoid class components.
- Routing is defined in `src/routes/index.tsx` via `createBrowserRouter`; protect authenticated routes with `ProtectedRoute`.
- State management uses React Context (`src/context`) and Zustand (`src/stores`) depending on feature scope.

## API and Auth Patterns

- For Spotify Web API requests, use `SpotifyApiClient` from `src/api/spotify/base.service.ts` (do not call axios directly).
- Handle `204` responses for playback endpoints by returning `null` as existing services do.
- For token refresh, rely on `getValidAccessToken` from `src/utils/tokenUtils.ts`; avoid duplicating refresh logic.
- Auth flow uses PKCE via `src/api/auth/service/auth.service.ts`; respect existing localStorage keys (`access_token`, `refresh_token`, `expires_in`, `expires`).
- Read environment variables via `import.meta.env` (e.g., `VITE_CLIENT_ID`, `VITE_REDIRECT_URI`).

## React Query and Hooks

- Data fetching and mutations should live in `src/api/spotify/hooks` and use TanStack React Query.
- Prefer creating a service method in `src/api/spotify` and then expose it through a hook.
- Keep hook return types explicit and consistent with existing patterns.

## Styling and UI

- Prefer Tailwind + DaisyUI classes over inline styles; keep class names consistent with surrounding code.
- Keep UI components small and composable; reuse `src/components` before creating new ones.

## Testing

- Tests use Vitest and React Testing Library.
- Place tests next to features in `**/*.test.{ts,tsx}` or `**/tests/**` as the repo currently does.
- Update or add tests when changing behavior, especially for services and hooks.
