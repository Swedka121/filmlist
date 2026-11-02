<!-- BEGIN:copilot-instructions -->

## FilmList - Development Guidelines for AI Agents

### Quick Start Commands

```bash
# Dev server (hot-reload)
npm run dev

# Build & lint check
npm run build
npm run lint

# Type checking
tsc --noEmit
```

---

### Architecture Overview

**Stack:**

- **Next.js 16.4.3** App Router with Server Components as default
- **TypeScript** strict mode (`"strict": true` in `tsconfig.json`)
- **TanStack React Query** for server state management (no Redux/Zustand)
- **Tailwind CSS v4** + **shadcn/ui** design system using `class-variance-authority`
- **@base-ui/react** component primitives
- **better-auth v1.7.12** with Drizzle adapter & Google OAuth (oneTap plugin)
- **Drizzle ORM** with PostgreSQL (`pg`)

---

### Project Layout

```
app/
├── api/auth/[...all]/route.ts          # better-auth API routes using toNextJsHandler
├── app/page.tsx                        # Root server component
components/
├── ui/                                 # Atomic design tokens (button, avatar, skeleton, toast)
├── blocks/                             # Functional blocks (Header, HeaderLogin)
├── layouts/                            # Layout wrappers (ClientLayout with QueryClient, Container)
└── scenes/                             # Complex interactive scenes (Three.js visualizations)
db/
└── schemas/
    ├── auth-schema.ts                  # Auth tables (better-auth generated)
    └── schema.ts                        # Business entities (film, film_list, etc.)
drizzle/                                # Type-safe migrations with timestamp names
lib/
├── auth.ts                             # Server-side better-auth configuration
├── authClient.ts                       # Client-side auth hooks & session management
└── db.ts                               # Database connection & QueryClient setup
```

---

### Conventions

#### Component Patterns

- **Server Components**: Default, no `"use client"` unless needed
- **Client Components**: Marked with `"use client"` at top of file
- **UI Kit Location**: `/app/src/components/ui/` - use existing atoms or create new ones following the `cn()` + variant pattern

#### Data Flow

1. **Server state**: TanStack React Query (`@tanstack/react-query`)
2. **No global state** (Redux/Zustand) - prefer server state via hooks
3. **API calls**: Fetch via `useQuery`, mutations via `useMutation`
4. **Auth**: Server-side via better-auth, client hooks via `authClient.useSession()`

#### Styling

- **Tailwind CSS v4** with utility-first approach
- Use `cn()` helper for class composition (from `class-variance-authority`)
- shadcn/ui component variants pattern: `className={cn(base, containerVariants.className({ variant }))}`

#### TypeScript

- Path alias: `@/*` → `/app/src/*` in `tsconfig.json`
- Strict mode enabled (`"strict": true`)
- Full type inference - no JSON schemas

---

### Database & Auth

#### Database Setup

- **Connection**: Defined in `/app/lib/db.ts`
- **Schema locations**: `/app/db/schemas/` (see above)
- **Migrations**: In `drizzle/` with timestamped folders and descriptive names
- **Type-safe queries**: Use `defineRelations()` for relations

#### Authentication

- **Library**: better-auth with Drizzle adapter
- **Providers**: Google OAuth via oneTap plugin
- **Server config**: `/app/lib/auth.ts`
- **Client hooks**: `/app/lib/authClient.ts` pattern: `authClient.useSession()`

#### API Routes

All auth routes are consolidated at `/app/src/app/api/auth/[...all]/route.ts` using `toNextJsHandler`.

---

### Common Pitfalls

1. **Forgetting `"use client"`** on components that need hooks or event handlers
2. **Mixing server/client state**: Keep server state in React Query, not `useState`
3. **Creating custom UI atoms** without following the shadcn/ui variant pattern (see `/app/src/components/ui/button.tsx`)
4. **Direct database access**: Always use the DB instance from `/app/lib/db.ts`
5. **Path aliases**: Use `@/*` not relative paths for src imports

---

### Key Files to Reference

| Purpose                      | Path                      |
| ---------------------------- | ------------------------- |
| Database connection & config | `/app/lib/db.ts`          |
| Server auth setup            | `/app/lib/auth.ts`        |
| Client auth hooks            | `/app/lib/authClient.ts`  |
| UI atoms (button, avatar)    | `/app/src/components/ui/` |
| Database schemas             | `/app/db/schemas/`        |

---

### Useful Documentation Links

- [Next.js App Router docs](https://nextjs.org/docs/app/building-your-application/routing)
- [TanStack React Query documentation](https://tanstack.com/query/latest/docs/react/overview)
- [better-auth docs](https://www.better-auth.com/)
- [Drizzle ORM docs](https://orm.drizzle.team/)
- [Tailwind CSS v4 docs](https://tailwindcss.com/docs)
- [shadcn/ui component patterns](https://ui.shadcn.com/docs/components/breaking-changes)

---

### Build & Deployment

**Development:**

```bash
npm run dev    # Start dev server at http://localhost:3000
```

**Production:**

```bash
npm run build      # Create production build
npm run start      # Run production server
```

**Type checking before commit:**

```bash
tsc --noEmit       # Catch type errors early
```

---

### File Naming Conventions

- **Components**: PascalCase (e.g., `Header.tsx`, `Button.tsx`)
- **UI atoms in `/ui/` folder**: lowercase with extension (`button.tsx`, `avatar.tsx`)
- **Database migrations**: generate it with `npx drizzle-kit generate` and execute on permission with `npx drizzle-kit migrate`

<!-- END:copilot-instructions -->
