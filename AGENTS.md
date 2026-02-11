# Project Overview

This is a **Linktree Clone** built with Next.js 15, Supabase, and shadcn/ui. Users can create their own link pages with links and products, customize their profile, and share their page with others.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui (New York style) |
| Backend/Auth | Supabase (SSR, Auth) |
| Icons | Lucide React |
| Theme | next-themes (dark/light mode) |

## Project Structure

```
app/
├── (app)/                    # Authenticated app routes
│   ├── layout.tsx            # App layout with header/nav
│   └── page.tsx              # Dashboard (link editor)
├── [username]/               # Public profile pages
│   └── page.tsx              # Public link page viewer
├── auth/                     # Authentication routes
│   ├── confirm/
│   ├── error/
│   ├── forgot-password/
│   ├── login/
│   ├── sign-up/
│   ├── sign-up-success/
│   └── update-password/
├── demo/                     # Demo page for marketing
├── instruments/              # Example data fetching page
├── protected/                # Legacy protected routes
├── layout.tsx                # Root layout with ThemeProvider
├── page.tsx                  # Landing page (marketing)
└── globals.css               # Global styles + Design System

components/
├── ui/                       # shadcn/ui components
├── link-card.tsx             # Link display component (edit/view modes)
├── link-editor.tsx           # Modal for editing/creating links
├── profile-editor.tsx        # Modal for editing profile
├── login-form.tsx
├── sign-up-form.tsx
├── theme-switcher.tsx
└── ...

lib/
├── supabase/
│   ├── client.ts             # Browser client factory
│   └── server.ts             # Server component client factory
├── database.types.ts         # TypeScript types for Supabase
└── utils.ts

supabase/
└── schema.sql                # Database schema to run in Supabase
```

## Design System: "Stone & Violet"

A sophisticated, warm-neutral palette with violet accents - perfect for influencers. Elegant, modern, not tacky.

### Color Palette

**Primary Colors:**
- Primary: `hsl(262 56% 58%)` - Sophisticated violet
- Primary Foreground: White

**Neutral Colors (Stone-based):**
- Background: `hsl(30 6% 97%)` - Warm off-white
- Foreground: `hsl(20 14% 10%)` - Deep charcoal
- Card: `hsl(30 6% 99%)` - Almost white
- Muted: `hsl(30 6% 92%)` - Light stone
- Border: `hsl(30 6% 88%)` - Subtle borders

**Accent Colors:**
- Accent: `hsl(262 50% 96%)` - Soft violet tint
- Gradient 1 (Violet): `linear-gradient(135deg, hsl(262 56% 58%), hsl(280 60% 55%))`
- Gradient 2 (Rose): `linear-gradient(135deg, hsl(340 75% 55%), hsl(0 72% 51%))`
- Gradient 3 (Teal): `linear-gradient(135deg, hsl(180 55% 45%), hsl(200 60% 50%))`
- Gradient 4 (Amber): `linear-gradient(135deg, hsl(30 80% 55%), hsl(45 90% 55%))`

### Design Principles

1. **Warm Neutrals**: Use stone-based grays instead of cool grays for a premium feel
2. **Violet Accents**: Use the primary violet sparingly for CTAs and highlights
3. **Consistent Radius**: Use `--radius: 0.75rem` for all rounded elements
4. **Subtle Shadows**: Use soft shadows for elevation (not harsh drop shadows)
5. **Smooth Transitions**: All interactive elements have subtle transitions

### CSS Variables

Defined in `app/globals.css`:

```css
:root {
  --background: 30 6% 97%;
  --foreground: 20 14% 10%;
  --card: 30 6% 99%;
  --primary: 262 56% 58%;
  --secondary: 30 6% 92%;
  --muted: 30 6% 92%;
  --accent: 262 50% 96%;
  --border: 30 6% 88%;
  --ring: 262 56% 58%;
  --radius: 0.75rem;
}
```

## Database Schema

### Tables

**profiles**
- `id`: UUID (PK)
- `user_id`: UUID (FK to auth.users)
- `username`: Text (unique, URL slug)
- `display_name`: Text
- `bio`: Text
- `avatar_url`: Text
- `theme`: Enum ('light', 'dark', 'auto')
- `background_style`: Enum ('solid', 'gradient', 'dots')
- `created_at`, `updated_at`: Timestamps

**links**
- `id`: UUID (PK)
- `profile_id`: UUID (FK)
- `title`: Text
- `url`: Text
- `type`: Enum ('link', 'product')
- `price`: Decimal (for products)
- `currency`: Text
- `gradient_style`: Enum ('none', 'gradient-1', 'gradient-2', 'gradient-3', 'gradient-4')
- `position`: Integer (for ordering)
- `is_active`: Boolean
- `clicks`: Integer (analytics)
- `created_at`, `updated_at`: Timestamps

**social_links**
- `id`: UUID (PK)
- `profile_id`: UUID (FK)
- `platform`: Text (instagram, twitter, etc.)
- `url`: Text
- `position`: Integer

### Setup

Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor to create all tables, indexes, and RLS policies.

## Key Conventions

### Supabase Client Pattern

Always use the factory functions:

```typescript
// Client components
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Server components/actions
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

### Path Aliases

| Alias | Path |
|-------|------|
| `@/components` | `./components` |
| `@/components/ui` | `./components/ui` |
| `@/lib` | `./lib` |
| `@/lib/utils` | `./lib/utils` |

### Adding shadcn Components

```bash
npx shadcn@latest add <component-name>
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (marketing) - redirects to `/dashboard` if logged in |
| `/dashboard` | Link editor dashboard (requires auth) |
| `/[username]` | Public profile page |
| `/auth/login` | Login page |
| `/auth/sign-up` | Sign up page |
| `/demo` | Demo profile page for marketing |

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Notes for AI Agents

- The design system is consistent across all pages - stick to the "Stone & Violet" palette
- Always use shadcn components when available
- Public profile pages use the username as the URL slug
- Links can be either regular links or products with prices
- Each link can have a gradient style or default styling
- The database schema includes RLS policies for security
- Profile is auto-created when a user signs up (via trigger)
