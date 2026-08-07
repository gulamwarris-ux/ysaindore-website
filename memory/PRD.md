# PRD — Young Scientist Academy (ysaindore.com)

## Original Problem Statement
Premium, modern, fast, mobile-first marketing website for Young Scientist Academy, Indore. Concept-based, activity-oriented science & maths coaching for Grades 3–10. Goals: generate admission enquiries, book free demos, promote the Board Selection Assessment, showcase concept-based learning, build parent trust.

Brand: "Concepts Today. Innovations Tomorrow." Palette: Royal Blue #0F3D8C, White, Golden Yellow #F5B400, Fresh Green #2E8B57. Typography: Poppins. Radius 12–16px.

## User Choices
- Forms: save to MongoDB AND send email (Emergent Resend).
- Board Selection Assessment: info section + enquiry form (no interactive quiz yet).
- Real content: phone 9926000920 provided; founder PDF (Dr. Arifa Sheikh); placeholders for photos/logo.
- Blog: working blog with seeded sample articles.

## Architecture
- Frontend: React 19 + Tailwind + shadcn/ui, framer-motion (kinetic hero, scroll reveals), Lenis smooth scroll, react-fast-marquee. Routes: `/`, `/blog`, `/blog/:slug`.
- Backend: FastAPI + MongoDB (motor). Endpoints: `POST/GET /api/enquiries`, `GET /api/blog`, `GET /api/blog/{slug}`. Startup seeds 4 blog posts.
- Email: Emergent managed Resend proxy; enquiry submissions email OWNER_EMAIL (non-blocking background task).

## User Personas
- Primary: Parents of Grade 3–10 students in Indore seeking quality science/maths coaching.
- Secondary: Students, schools, education partners.

## Implemented (2026-06)
- Sticky glass header + mobile menu; kinetic hero with masked line-by-line reveal + parallax image.
- Trust bar, Courses bento grid (6 programs), signature Board Assessment (yellow) section.
- About: numbered manifesto chapters + Founder card (Dr. Arifa Sheikh).
- Editorial marquee ribbon, Why Parents Choose Us bento, Learning Journey (6 steps).
- Achievements masonry gallery, parent testimonials, CTA, Contact (form + Google Map + click-to-call).
- Footer with quick links/courses/contact/socials. Floating WhatsApp + Call buttons.
- Global enquiry dialog (demo/contact/assessment/admission) + inline contact form → DB + email.
- Working blog (list + detail) from backend seed. SEO meta + EducationalOrganization schema + favicon.
- Verified: 100% backend + frontend E2E (test_reports/iteration_1.json).

## Backlog
- P1: Interactive Board Selection Assessment quiz with scored result.
- P1: Configure real OWNER_EMAIL inbox + real photos/logo/testimonials; spam protection (captcha/rate limit) on enquiries.
- P2: Admin dashboard for enquiries; Student login / Parent dashboard; online fee payment; study material downloads; online test series; career guidance.

## Next Tasks
- Replace placeholder assets with real academy photos and confirmed testimonials.
- Set OWNER_EMAIL to a monitored inbox before launch.
