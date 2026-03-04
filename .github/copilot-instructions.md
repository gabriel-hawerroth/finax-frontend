# Finax Frontend — AI Coding Instructions

Personal finance management app built with **Angular 21 (zoneless, SSR, standalone components)**.

## Product & Business Vision

Finax is a **personal finance SaaS** focused on helping users make better day-to-day decisions through a clear cash-flow view and guided insights.

### Core Value Proposition

- Simplify personal finance management with a modern, intuitive experience.
- Centralize key domains: cash flow, accounts, categories, credit cards, invoices, and reports.
- Turn financial data into practical decisions (dashboard, trends, category analysis, balance evolution).
- Support both web and mobile usage patterns.

### Target Users

- People managing personal or family budgets who need visibility of revenues, expenses, and upcoming obligations.
- Users transitioning from spreadsheets/manual control to a structured financial workflow.
- Users expecting progressive maturity: start simple, unlock more advanced features over time.

### Business Model & Plans

- Product is offered as **subscription SaaS** (see terms of use).
- User access levels are tiered (`FREE`, `BASIC`, `PREMIUM`) and enforced by route guards.
- During pre-launch/early-access phases, premium incentives may exist (e.g., lifetime premium campaigns).
- Feature work must preserve clear plan boundaries and avoid accidental cross-tier access.

### Primary Product Journeys

1. **Activation & onboarding**: account creation, email activation, login, password recovery.
2. **Daily finance operation**: create/manage releases (revenues, expenses, transfers), attachments, recurring entries.
3. **Structure setup**: accounts/subaccounts, credit cards, categories.
4. **Monitoring**: home dashboard, monthly balance, payable/receivable, current invoice status.
5. **Analysis**: reports by category, by account, and balance evolution.
6. **Account lifecycle**: profile/settings, plan/billing actions, cancellation flow with confirmation email.

### Product KPIs (Business Context)

- Activation and first successful login.
- Recurring engagement in cash-flow and release operations.
- Retention driven by report usage and perceived insight quality.
- Conversion/upgrade between tiers and plan continuity.
- Reliability and trust indicators (availability, safe data handling, predictable behavior).

### AI Implementation Priorities (Business-Aware)

When generating or changing code, prioritize:

1. **User trust first**: no silent data loss, no ambiguous destructive actions, clear confirmations.
2. **Financial clarity**: keep language and UI states explicit for balances, due dates, paid/unpaid, and projections.
3. **Tier safety**: respect access rules in routes/UI/services; never expose premium functionality by mistake.
4. **Operational continuity**: optimize for fast, stable core workflows (cash flow, accounts, cards, reports).
5. **Localization quality**: all user-facing text must remain i18n-ready and consistent across supported languages.
6. **Supportability**: errors must be actionable for users and diagnosable for support.

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

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
