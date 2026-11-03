# FilmList App Development Plan

## Overview

A pet project film tracking application with user-managed lists, TMDB integration, and scraper infrastructure for fetching film data.

## Architecture Summary

### Current State ✅

- **Next.js 16.4.3** with App Router (Server Components default)
- **better-auth v1.7.12** with Google OAuth (oneTap plugin)
- **Drizzle ORM** + PostgreSQL database
- Basic schema: filmList, filmListUser, film tables
- UI components: button, avatar, skeleton, toast
- Header blocks: client auth integration

### Required Features

1. **Home Screen** - User lists with search/filter, create new list
2. **User Panel** - GDPR settings (privacy, data export, etc.)
3. **List Screen** - Add films, mark viewed, visibility settings
4. **TMDB Integration** - Connect TMDB API for film search
5. **Scraping Service** - Redis queues + Rust service integration

## Development Phases

### Phase 1: Foundation & Home Screen

#### 1.1 Environment Setup

- Add `.env` variables (DB_URL, BETTER_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) Ready
- Install dependencies: `@tanstack/react-query`, `class-variance-authority`, `cn` Ready

#### 1.2 Authentication Hooks

- Create auth hooks in `/app/src/lib/authClient.ts`:
  - `useSession()` for client component auth
  - `useUserLists()` to fetch user's film lists
  - `useCreateList()` mutation for new lists

#### 1.3 Home Page Layout

- Design home screen layout with:
  - Search bar for list names
  - Filter controls (private/public)
  - "Create New List" button/modal
  - User panel dropdown (avatar + GDPR menu)
- Create user panel component without GDPR options for now

#### 1.4 Film Lists Display

- Build list card components:
  - Thumbnail image
  - Name, created date
  - Viewer count (users in list)
  - Public/private badge
  - Edit/delete actions
- Implement list search filter logic
- Implement list visibility toggle UI
- Create `/app/app/lists/[listId]/page.tsx` for list detail page
- Extract client components to `/components/scenes/ListScene.tsx` (optional, but can start simple)

### Phase 2: List Management Screen

#### 2.1 Add Films Feature

- Build "Add Film" form/modal:
  - Manual entry fields (title, description, link, image URL)
  - Import from TMDB dropdown
  - Auto-fill from scraped sources (future enhancement)
- Create film management UI:
  - Drag-and-drop reordering or numbered position input
  - Delete film button
  - "Mark as Viewed" checkbox

#### 2.2 Visibility Settings

- Add settings panel for list:
  - Toggle: Public/Private radio buttons
  - User management for access control (Owner, Edit, Read roles)
  - Share link generation (if public)
- Store visibility in `filmList` table via existing structure

#### 2.3 Filter Controls

- Implement filter bar on list screen:
  - Show all / In Queue only / Viewed only toggle
  - Visual indicator for status (color-coded checkboxes)

### Phase 3: TMDB Integration

#### 3.1 Client Setup

- Register TMDB API key (pet project usage limits acceptable)
- Add `.env` variable: `TMDB_API_KEY`

#### 3.2 API Client Module

- Create `/app/lib/tmdb.ts`:
  - Function: `searchFilm(title)` returning Promise<TMDBFilm>
  - Function: `getFilmDetails(filmId)` returning Promise<TMDBFilmDetail>
  - Optional: Cache layer with in-memory store (or Redis later)

#### 3.3 UI Integration

- Add TMDB search dropdown to "Add Film" form:
  - Debounced search input → fetch search results
  - Dropdown list of matching films
  - Select film → auto-fill all fields
- Add TMDB import button:
  - Fetch top-rated / popular films
  - Import multiple at once (batch processing)

### Phase 4: Scraping Service Infrastructure

#### 4.1 Redis Setup

- Add `redis` npm package to main app
- Create `/app/lib/redis.ts`:
  - Redis client singleton
  - Queue publishers/helpers for job dispatch
- Configure `.env` with REDIS_URL

#### 4.2 Job Queue System

- Define job types in `/app/lib/jobs/types.ts`:
  - `FilmScrapeJob` - scrape films from source site
  - `ProcessScrapeResults` - parse and store results
- Create queue handlers in `/app/services/scraper-queue.ts`:
  - Subscribe to Redis queues
  - Parse scrape responses
  - Store in DB via Drizzle

#### 4.3 Rust Integration (External Service)

- Document interface for external Rust service:
  - HTTP endpoint: `POST /scrape`
    - Payload: `{ sourceUrls: string[], options: { ... } }`
    - Response: `{ jobId: uuid, status: 'queued' }`
  - Webhook callback URL configured in env
- Create `/app/lib/rust-scaper-client.ts`:
  - HTTP client to call Rust service
  - Job submission + status polling

#### 4.4 Source Integration

- Document format for scraping source sites:
  - Source URL list (crawl target)
  - Expected HTML structure (per source)
  - API response contracts
- Leave room for future sources in scraper config

### Phase 5: User Panel & GDPR

#### 5.1 GDPR Component

- Create `/components/ui/gdpr-panel.tsx`:
  - Export data button (fetch all lists + films as JSON/CSV)
  - Delete account button
  - Privacy settings toggle
  - Cookie/Third-party preferences
- Integrate into user panel dropdown

#### 5.2 Settings Page

- Create `/app/app/settings/page.tsx`:
  - GDPR options
  - Notification preferences
  - Password change (optional, via better-auth)
- Link from user panel

### Phase 6: Polish & Deployment

#### 6.1 Error Handling

- Add toast notifications for failures
- Form validation with error messages
- Loading skeletons where appropriate

#### 6.2 Performance

- Optimize images (next/image component)
- Implement pagination/lazy loading for film lists
- Cache expensive TMDB calls

#### 6.3 Security

- Sanitize user input (XSS prevention)
- Rate limit API endpoints if needed
- Validate file uploads (if any)

## Key Files to Create/Modify

### Core

- `/app/src/lib/authClient.ts` - Add hooks
- `/app/src/lib/tmdb.ts` - TMDB API client
- `/app/src/lib/redis.ts` - Redis client
- `/app/src/lib/jobs/types.ts` - Job type definitions
- `/app/src/services/scraper-queue.ts` - Scraper queue handlers

### Components

- `/components/ui/gdpr-panel.tsx` - GDPR panel
- `/components/scenes/ListScene.tsx` - List management scene (optional)
- `/components/blocks/UserPanel.tsx` - User panel dropdown
- `/components/blocks/HeaderLogin.tsx` - Update to include user panel

### Pages

- `/app/app/lists/[listId]/page.tsx` - List detail page
- `/app/app/settings/page.tsx` - Settings/GDPR page
- `/app/app/page.tsx` - Home screen (modify)

### Schema Migrations

- Add new tables if needed (gdpr_settings optional table, or store in user preferences)
- Update migration files in `drizzle/` folder

## Verification Steps

1. **After Phase 1**: Run `npm run dev`, check home page renders with search and user panel
2. **After Phase 2**: Verify list creation → films added → viewed status toggle works
3. **After Phase 3**: Test TMDB search → import functionality
4. **After Phase 4**: Install Redis, verify queue system responds to job submissions
5. **After Phase 5**: Click GDPR buttons in user panel, verify data export works
6. **Before build**: Run `npm run lint` and `tsc --noEmit`

## Recommendations

### Priority Ordering

1. Complete Phases 1-2 (core functionality first)
2. Add TMDB integration (Phase 3) - high value for film tracking
3. Build scraping infrastructure (Phase 4) - foundational for data ingestion
4. Implement GDPR panel (Phase 5) - regulatory compliance

### Alternative Approaches

#### Scraping Service

- **Option A**: Run scrapers in Node.js/TypeScript within this app → simpler deployment
- **Option B**: External Rust microservice via HTTP + webhooks → more complex but isolates heavy lifting
- **Recommendation**: Start with Option B (external Rust), as you mentioned planned to write it. Leave interface contract defined for easy handoff.

#### TMDB Integration

- Use their public v3 API (no key needed for basic usage) or v4 (requires key, better limits)
- Cache responses in-memory or Redis if fetch rate becomes an issue

## Notes for You

- This is your pet project — keep it simple initially
- Focus on getting core features working before optimization
- TMDB integration will save you manual entry time
- Scraping infrastructure: define the contract first (input/output format), then implement Rust service separately
- GDPR panel: even simple implementation (export data, delete account) meets basic requirements
