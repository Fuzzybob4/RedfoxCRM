# RedFox CRM - Complete Business Management Solution

A comprehensive Customer Relationship Management (CRM) system built with Next.js 15, React 19, and Supabase. Designed specifically for outdoor lighting, landscaping, and irrigation businesses.

## 🔐 Login Credentials

### Admin Access
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `redfox2024!`
- **Capabilities**: Full system access, can view and edit all user dashboards, manage system settings

### Demo User Accounts
Test the system with these pre-configured accounts:

1. **Demo User**
   - **Email**: `demo@example.com`
   - **Password**: `demo123`
   - **Profile**: Basic user with sample data

2. **John Doe**
   - **Email**: `john@example.com`
   - **Password**: `john123`
   - **Profile**: Business owner with customer data

3. **Jane Smith**
   - **Email**: `jane@example.com`
   - **Password**: `jane123`
   - **Profile**: Manager with project data

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or later
- pnpm (recommended) or npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/redfox-crm.git
   cd redfox-crm
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pnpm install
   # or
   npm install
   \`\`\`

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_DOMAIN=localhost:3000
   
   # Email Configuration (Optional)
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=noreply@yoursite.com
   
   # SMTP Configuration (Alternative to SendGrid)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   SMTP_SECURE=false
   \`\`\`

4. **Database Setup**
   Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   \`\`\`bash
   # Execute in order:
   scripts/create-complete-schema.sql
   scripts/create-onboarding-tables.sql
   scripts/create-provision-function.sql
   scripts/fix-rls-policies.sql
   \`\`\`

5. **Start Development Server**
   \`\`\`bash
   pnpm dev
   # or
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

\`\`\`
redfox-crm/
├── app/                          # Next.js App Router
│   ├── components/              # Shared components
│   │   ├── auth-provider.tsx    # Authentication context
│   │   ├── header.tsx           # Main navigation
│   │   ├── login-dialog.tsx     # Login/signup modal
│   │   └── ...
│   ├── dashboard/               # Protected dashboard pages
│   ├── features/                # Feature showcase pages
│   ├── industries/              # Industry-specific pages
│   ├── api/                     # API routes
│   └── globals.css              # Global styles
├── components/ui/               # Reusable UI components
├── lib/                         # Utility functions
│   ├── supabase.ts             # Supabase client
│   ├── auth.ts                 # Authentication utilities
│   └── database.types.ts       # TypeScript definitions
├── scripts/                     # Database scripts
├── public/                      # Static assets
└── middleware.ts               # Route protection
\`\`\`

## 🛠 Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19.0.0** - UI library with latest features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & authorization
- **Supabase Auth Helpers** - Next.js integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Fast package manager

## 🔒 Security Features

### Authentication
- **Email/Password** authentication
- **Google OAuth** integration
- **Session management** with secure cookies
- **Password reset** functionality
- **Email verification**

### Authorization
- **Role-based access control** (RBAC)
- **Row Level Security** (RLS) policies
- **Protected routes** with middleware
- **Admin panel** access control

### Data Protection
- **Environment variables** for sensitive data
- **HTTPS enforcement** in production
- **CSRF protection**
- **SQL injection prevention**

## 📱 Features

### Core CRM Features
- **Customer Management** - Complete customer database
- **Project Tracking** - Job management and progress tracking
- **Invoice Generation** - Professional invoicing system
- **Scheduling** - Calendar integration and appointment booking
- **Estimates** - Quote generation and management
- **Reporting** - Business analytics and insights

### Industry-Specific Features
- **Outdoor Lighting** - Specialized tools and templates
- **Landscaping** - Project planning and resource management
- **Irrigation** - System design and maintenance tracking

### User Experience
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching
- **Real-time Updates** - Live data synchronization
- **Offline Support** - Progressive Web App features
- **Search & Filtering** - Advanced data discovery

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push

### Manual Deployment
1. **Build the project**
   \`\`\`bash
   pnpm build
   \`\`\`

2. **Start production server**
   \`\`\`bash
   pnpm start
   \`\`\`

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- Email service credentials (if using)

## 🔧 Development

### Available Scripts
\`\`\`bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks

# Database
pnpm db:types     # Generate TypeScript types from Supabase
pnpm db:reset     # Reset database (development only)
\`\`\`

### Code Style
- **ESLint** configuration for Next.js and React
- **Prettier** for consistent formatting
- **TypeScript** strict mode enabled
- **Conventional commits** recommended

### Testing
\`\`\`bash
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate coverage report
\`\`\`

## 📊 Performance

### Optimization Features
- **Server-side rendering** (SSR)
- **Static site generation** (SSG) where applicable
- **Image optimization** with Next.js Image component
- **Code splitting** and lazy loading
- **Bundle analysis** tools

### Performance Monitoring
- **Web Vitals** tracking
- **Real User Monitoring** (RUM)
- **Error tracking** with Sentry (optional)
- **Analytics** integration ready

## 🎨 Customization

### Theming
- **Tailwind CSS** configuration in `tailwind.config.js`
- **CSS custom properties** for dynamic theming
- **Dark/light mode** toggle
- **Brand colors** easily customizable

### Components
- **Radix UI** primitives for accessibility
- **Custom components** in `components/ui/`
- **Consistent design system**
- **Responsive breakpoints**

### Content Management
- **Static content** in components
- **Dynamic content** from Supabase
- **Internationalization** ready (i18n)
- **SEO optimization** built-in

## 🤝 Contributing

### Getting Started
1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Make your changes**
4. **Run tests and linting**
   \`\`\`bash
   pnpm lint
   pnpm type-check
   pnpm test
   \`\`\`
5. **Commit your changes**
   \`\`\`bash
   git commit -m 'Add amazing feature'
   \`\`\`
6. **Push to your branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
7. **Open a Pull Request**

### Code Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Use TypeScript for type safety
- Follow accessibility best practices

## 📞 Support

### Documentation
- **API Documentation** - Available in `/docs/api`
- **Component Library** - Storybook integration
- **Database Schema** - ERD diagrams in `/docs/database`

### Getting Help
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Community support and questions
- **Email Support** - contact@redfoxcrm.com

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Supabase Team** - Excellent backend-as-a-service
- **Vercel Team** - Seamless deployment platform
- **Radix UI Team** - Accessible component primitives
- **Tailwind CSS Team** - Utility-first CSS framework

---

**RedFox CRM** - Empowering outdoor service businesses with modern technology.

For more information, visit our [website](https://redfoxcrm.com) or contact us at [support@redfoxcrm.com](mailto:support@redfoxcrm.com).
