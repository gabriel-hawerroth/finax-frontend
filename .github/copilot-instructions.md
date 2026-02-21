# Finax Frontend — AI Coding Instructions

Personal finance management app built with **Angular 21 (zoneless, SSR, standalone components)**.

## Architecture

```
src/app/
├── core/           # Domain layer: entities, services, guards, interceptors, events
│   ├── entities/   # One folder per domain (account/, release/, category/, credit-card/, …)
│   ├── enums/      # Shared enums
│   ├── events/     # Global cross-component events (module-level RxJS Subjects)
│   └── guards/     # Functional CanActivateFn guards (FreeTier, BasicTier, etc.)
├── main/           # Feature pages and sidebar
│   ├── pages/      # Authenticated feature pages (home, cash-flow, accounts, …)
│   └── public/     # Unauthenticated views (login, create-account, landing page)
└── shared/         # Reusable components, directives, pipes, services, utils
```

## Key Conventions

### Components

- **Always standalone** with `ChangeDetectionStrategy.OnPush` (configured in `angular.json` schematics).
- Zoneless — `provideZonelessChangeDetection()` is active; never rely on zone.js.
- **Naming suffixes**: `Page` (routed views), `Widget` (embedded sections), `Dialog` (mat-dialog/bottom-sheet), `Component` (reusable sub-components).
- **Template variables must be Signals** — use `signal()`, `computed()`, and `input.required()`. Never use plain class fields in templates.
- SCSS styling, with shared mixins importable from `src/app/shared/styles/`.

### Dependency Injection

- Inject-based: `private readonly _utilsService = inject(UtilsService)` (underscore prefix).
- For functional contexts (guards, interceptors, initializers): `paramName = inject(Service)` as default parameter.

### Entity Layer (`core/entities/{domain}/`)

Each domain folder contains exactly 3 files:

- `{entity}.ts` — TypeScript **interfaces** (not classes) for the model.
- `{entity}-dto.ts` — DTOs, dialog data interfaces, form configs.
- `{entity}.service.ts` — HTTP service (`@Injectable({ providedIn: 'root' })`).

### HTTP Services

- **All HTTP calls return `Promise<T>`** via `lastValueFrom()`. Never expose raw Observables to consumers.
- Base URL pattern: ``private readonly apiUrl = `${environment.baseApiUrl}{resource}`;``
- Query params via `HttpParams().append()`.
- Auth is **cookie-based** (`withCredentials: true` set in `auth.interceptor.ts`); no Authorization headers.

### Reactive Forms

- Form groups are built with reactive forms, generaly on components.

### State & Reactivity

- **Signals** for all component-local state (`signal()`, `computed()`).
- **RxJS Subjects** only for cross-component events (see `core/events/events.ts`).
- Cleanup: `Subject` + `takeUntil` in `ngOnDestroy`, or `takeUntilDestroyed()`.
- Updating signal arrays: always spread to create new reference — `rows.update(r => [...r])`.

### Data Loading

```typescript
ngOnInit(): void {
  this._service.getData()
    .then(result => this.data.set(result))
    .catch(() => this.error.set(true))
    .finally(() => this.loaded.set(true));
}
```

### i18n

- `@ngx-translate` with JSON files in `src/assets/i18n/` (pt-BR, en-US, es-CO, de-DE).
- Default language: `pt-BR`. Route paths are in Portuguese.
- In templates: `{{ 'key.subkey' | translate }}`. In code: `this._translateService.instant('key')`.
- Messages shown via `UtilsService.showMessage('i18n.key')`.

### Theming

- `ThemingService` applies themes using ~35 signals mapped to CSS custom properties via `effect()`.

### Routing

- All routes lazy-loaded: `loadComponent: () => import(...).then(m => m.PageName)`.
- Tier-based guards: `FreeTierGuard`, `BasicTierGuard`, `PremiumTierGuard`.
- Routes in Portuguese (`fluxo-de-caixa`, `cartoes-de-credito`, `meu-perfil`).

## Dev Workflow

- `npm start` / `ng serve` — dev server at `http://localhost:4200`
- `npm run build:prod` — production build with SSR
- `npm test` — Karma tests
- Branch from `develop`, PR back to `develop`.

## Key Files

- [app.config.ts](../src/app/app.config.ts) — providers (zoneless, SSR hydration, interceptors, i18n, currency, Sentry)
- [app.routes.ts](../src/app/app.routes.ts) — all lazy-loaded routes
- [core/events/events.ts](../src/app/core/events/events.ts) — global event Subjects
- [shared/utils/utils.service.ts](../src/app/shared/utils/utils.service.ts) — user state, snackbar, confirm dialog, localStorage
- [shared/services/responsive.service.ts](../src/app/shared/services/responsive.service.ts) — signal-based breakpoint detection

# Angular instructions

- This projects use Angular 21, make sure to use the latest features and best practices
- Use the inject method instead of a constructor
- Make use of signals where possible
- Always use control flow
- Use signal inputs and outputs
- Don't add standalone properties to decorators, this is enabled by default
- Import rxjs operators from 'rxjs' instead of 'rxjs/operators'
- Always use reactive forms

# Angular 21 documentation

- https://v21.material.angular.dev/components/categories
