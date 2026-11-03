# Yash Chourey — Graphic Designer Portfolio & CMS

A production-grade, content-driven, customizable portfolio website for **Yash Chourey** (Graphic Designer & Visual Brand Strategist), equipped with a modern public portfolio and a secure **Supabase-backed Admin CMS**.

---

## 🚀 Key Features

### 1. Public Portfolio
- **Dynamic Hero Section**: High-impact editorial composition featuring `hero.jpeg`, custom radial and dual vignette gradient overlays, animated status pill indicator, and responsive typography.
- **Glassmorphic Navigation**: Sticky top navigation bar with sliding active indicator pill inspired by the Mentality reference, responsive mobile drawer menu, and smooth scrolling.
- **Typographic Discipline Tabs**: Full work catalogue directly reflecting the structure in `ui.jpeg` across 6 core disciplines:
  - **LogoFolio**: Logomarks, monograms, vector characters & mascots.
  - **Branding**: Full brand boards, stationery suites, foil mockups & guidelines.
  - **Social Media Creatives**: High-converting Instagram carousels & campaigns.
  - **Thumbnails**: High-CTR cinematic YouTube thumbnails with photo composites.
  - **A+ Content**: Amazon product listings and e-commerce conversion banners.
  - **Banners**: Large-format outdoor billboards and web promotional display banners.
- **Case Study Detail Pages (`/work/:slug`)**: Deep-dive project pages with client details, year, services list, full creative narrative, gallery images, and category-related projects.
- **Functional Contact Form**: Direct integration with **Web3Forms** (`3a7ee953-cb3a-48a4-97e6-de3723e980c8`), complete with validation, loading states, and instant success feedback.
- **Experience, Education & Skills**: Relational data-driven sections with progress bars, chronology timelines, and responsive layouts.

### 2. Admin CMS (`/admin`)
- **Authentication**: Secured with Supabase Auth session persistence and route protection guards.
- **Project Management (`/admin/projects`)**:
  - Full CRUD: Create, Edit, Delete (with confirmation dialog).
  - Draft vs Live publishing toggle.
  - Homepage Featured toggle (★).
  - Custom slugs, display ordering, and client metadata.
- **Image Upload System (`src/services/storage.ts`)**: Direct upload to Supabase Storage `portfolio` bucket with client-side file size and MIME-type validation.
- **Category Taxonomy (`/admin/categories`)**: Add, edit, or delete portfolio categories with custom slugs and grid descriptions.
- **Site Copy & Headings (`/admin/content`)**: Real-time editor for Hero headlines, subheadings, About narrative, Contact copy, and Footer copyright.
- **Experience & Education Management**: Update career milestones, dates, roles, and institutional credentials.
- **Skills Management**: Control technical proficiency percentages, tool names, and category groups.
- **Settings & Profile (`/admin/settings`)**: Manage contact email, phone, location, and social links (Behance, Instagram, Dribbble, LinkedIn).

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, custom design tokens, responsive `clamp()` typography
- **Motion & Interactions**: Framer Motion
- **Icons & Notifications**: `react-hot-toast`
- **Routing**: `react-router-dom` v7
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **Forms**: Web3Forms API
- **SEO**: `react-helmet-async`, semantic HTML5, OpenGraph tags, `robots.txt`

---

## 🗄 Database Setup (Supabase)

1. Open your Supabase project dashboard.
2. Go to the **SQL Editor**.
3. Run the schema script located at:
   ```text
   supabase/schema.sql
   ```
   *This automatically creates all 9 relational tables, enables RLS policies (public SELECT on published data, authenticated full access for admin), indexes, default seed data, and storage bucket configuration.*
4. In **Storage**, verify that a public bucket named `portfolio` exists.
5. Create an admin user under **Authentication > Users**.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build & typecheck
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub / GitLab.
2. Import the project into **Vercel**.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in **Project Settings > Environment Variables**.
4. Set Framework Preset to **Vite**.
5. Deploy!
