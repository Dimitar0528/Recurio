# Recurio

> The modern way to track, manage, and optimize all your recurring expenses in one place.

Recurio helps users gain complete visibility over recurring expenses, upcoming renewals, and spending habits across all their subscriptions. From streaming platforms and software licenses to gym memberships and cloud services, Recurio ensures users never lose track of where their money goes.

---
## ✨ Features
### Subscription Dashboard
Get a complete overview of all active subscriptions in a single place.

- Active, expired, and cancelled subscriptions
- Monthly and yearly billing cycles
- Renewal tracking
- Next payment visibility
- Subscription categorization
- Search, filtering and sorting supported
---

### Spending Analytics
Understand exactly how much you're spending.
- Monthly / Yearly subscription costs
- Spending breakdown by category
- Most expensive subscriptions
- Subscription trends over time
- Interactive charts and visualizations
---

### Smart Renewal Reminders
- Email reminders 7 days before renewal
- Configurable notification preferences
- Upcoming payment alerts
---

###  Flexible Renewal Management
Support for different subscription scenarios.
#### Auto-Renewing Subscriptions
Subscriptions that automatically renew and charge users at the end of the billing cycle.

Examples:
- Netflix
- Spotify
- YouTube Premium
#### Manual Renewal Subscriptions
Subscriptions that require users to manually renew after expiration.

Examples:
- Domain registrations
- Certain software licenses
- Event memberships

### Authentication & Security
Secure authentication powered by Clerk.

Features include:
- Email/password authentication
- Social login providers
- Protected routes
- Secure user management
---

### Internationalization
- Multi-language support
- Locale-based routing
- Translated UI components and localized dates
---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui
- Lucide Icons
- next-intl
### Backend
- Next.js Server Actions
- Zod Validation
### Authentication
- Clerk
### Database / ORM
- PostgreSQL / Drizzle
### Email Service
- Resend
---

## Project Structure

```text
├── messages/
src/
│
├── app/
│   ├── [lang]/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── payments/
│   └── shared/
│
├── dal/
│   ├── subscriptions/
│   ├── users/
│
├── db/
│
├── i18n/
│
├── lib/
│   ├── analytics/
│   ├── security/
│   ├── validations/
│
```

---

## Getting Started
### Prerequisites
- Node.js 22+
- Bun (for package management)
- PostgreSQL
- Clerk Account
- Resend Account
---
### Installation
Clone the repository:
```bash
git clone https://github.com/Dimitar0528/Recurio.git
cd Recurio
```

Install dependencies:
```bash
bun install
```
---

### Environment Variables
Create a `.env.local` file and fill in the needed informatiom:
```env
# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Resend
RESEND_API_KEY=
```
---

### Database Setup
Generate migrations:
```bash
bun run db:gen
```
Run migrations:
```bash
bun run db:migrate
```
Open database studio:
```bash
bun run db:studio
```
---

### Run Development Server
```bash
bun run dev
```
Open:
```text
http://localhost:3000
```
---

## Roadmap

### Planned Features
- Smart Add Subscription functionality
- Budget goals
- AI-powered spending insights
- More advanced and in-depth analytics
---

## Contributing

Contributions, issues, and feature requests are welcome.
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request
---

## License
This project is licensed under the MIT License.
See the [LICENSE](https://github.com/Dimitar0528/Recurio/blob/main/LICENSE) file for details.
