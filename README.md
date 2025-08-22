# 🦊 RedFox CRM - Complete Business Management Solution

A modern, full-featured Customer Relationship Management (CRM) system built with Next.js 15, React 19, and Supabase. Designed specifically for service-based businesses like landscaping, outdoor lighting, and irrigation companies.

## 🔐 Login Credentials

### Admin Access
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `redfox2024!`
- **Capabilities**: Full system access, can view and edit all user dashboards

### Demo User Accounts
1. **Demo User**
   - **Email**: `demo@example.com`
   - **Password**: `demo123`
   - **Features**: Basic user with sample data

2. **John Doe**
   - **Email**: `john@example.com`
   - **Password**: `john123`
   - **Features**: Advanced user with project data

3. **Jane Smith**
   - **Email**: `jane@example.com`
   - **Password**: `jane123`
   - **Features**: Manager-level access with team data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
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
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Configure Environment Variables**
   \`\`\`env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_DOMAIN=localhost:3000
   
   # Email Configuration (Optional)
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_app_password
   SENDGRID_API_KEY=your_sendgrid_key
   
   # SMTP Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@example.com
   SMTP_PASSWORD=your_app_password
   SMTP_SECURE=true
   \`\`\`

5. **Run Development Server**
   \`\`\`bash
   pnpm dev
   # or
   npm run dev
   \`\`\`

6. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
redfox-crm/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/               # Login page
│   │   └── signup/              # Registration page
│   ├── admin/                   # Admin panel
│   │   ├── dashboard/           # Admin dashboard
│   │   └── login/               # Admin login
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   └── customers/           # Customer management
│   ├── components/              # Shared components
│   │   ├── auth-provider.tsx    # Authentication context
│   │   ├── header.tsx           # Main navigation
│   │   ├── login-dialog.tsx     # Login modal
│   │   └── sidebar.tsx          # Dashboard sidebar
│   ├── dashboard/               # Protected dashboard
│   │   └── [userId]/            # User-specific dashboards
│   ├── customers/               # Customer management
│   ├── invoices/                # Invoice system
│   ├── estimates/               # Estimate creation
│   ├── projects/                # Project tracking
│   ├── mapping/                 # Route optimization
│   ├── scheduling/              # Appointment system
│   ├── settings/                # User preferences
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utility libraries
│   ├── supabase.ts             # Database client
│   ├── auth.ts                 # Authentication helpers
│   └── utils.ts                # Common utilities
├── hooks/                       # Custom React hooks
├── scripts/                     # Database scripts
└── public/                      # Static assets
\`\`\`

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.1
- **Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **State Management**: React Context + Zustand

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Development
- **Language**: TypeScript 5.3.3
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## 🔒 Authentication & Security

### Authentication Methods
- **Email/Password**: Traditional login system
- **Google OAuth**: Social authentication
- **Magic Links**: Passwordless login (optional)
- **Admin Panel**: Separate admin authentication

### Security Features
- **Row Level Security (RLS)**: Database-level access control
- **JWT Tokens**: Secure session management
- **CSRF Protection**: Built-in Next.js protection
- **Input Validation**: Server-side validation
- **Rate Limiting**: API endpoint protection

### User Roles
- **Admin**: Full system access
- **Manager**: Team and project management
- **User**: Basic CRM functionality
- **Viewer**: Read-only access

## 📊 Core Features

### Customer Management
- **Contact Database**: Comprehensive customer profiles
- **Communication History**: Track all interactions
- **Document Storage**: File attachments and notes
- **Custom Fields**: Flexible data structure

### Project & Job Management
- **Project Tracking**: Status, progress, and milestones
- **Task Management**: Assign and track work items
- **Time Tracking**: Log hours and productivity
- **Photo Documentation**: Before/after project photos

### Financial Management
- **Invoice Generation**: Professional invoice creation
- **Estimate System**: Quote generation and approval
- **Payment Tracking**: Monitor payment status
- **Financial Reporting**: Revenue and profit analysis

### Scheduling & Routing
- **Calendar Integration**: Appointment scheduling
- **Route Optimization**: Efficient travel planning
- **Team Scheduling**: Resource allocation
- **Mobile Sync**: Field team coordination

### Reporting & Analytics
- **Dashboard Metrics**: Key performance indicators
- **Custom Reports**: Flexible reporting system
- **Data Export**: CSV, PDF export options
- **Business Intelligence**: Growth insights

## 🎨 UI/UX Features

### Design System
- **Modern Interface**: Clean, professional design
- **Dark/Light Mode**: Theme switching
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant

### User Experience
- **Intuitive Navigation**: Easy-to-use interface
- **Quick Actions**: Streamlined workflows
- **Search & Filters**: Fast data discovery
- **Keyboard Shortcuts**: Power user features

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   \`\`\`bash
   vercel --prod
   \`\`\`

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure Supabase URLs are configured correctly

3. **Domain Configuration**
   - Set up custom domain
   - Configure DNS settings

### Manual Deployment
1. **Build Application**
   \`\`\`bash
   pnpm build
   \`\`\`

2. **Start Production Server**
   \`\`\`bash
   pnpm start
   \`\`\`

### Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

### Mobile Features
- **Touch Optimized**: Finger-friendly interface
- **Offline Support**: PWA capabilities
- **Native Feel**: App-like experience
- **Fast Loading**: Optimized performance

## 🔧 Development

### Available Scripts
\`\`\`bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript checking

# Database
pnpm db:generate  # Generate database types
pnpm db:push      # Push schema changes
pnpm db:seed      # Seed database with sample data

# Testing
pnpm test         # Run tests
pnpm test:watch   # Watch mode testing
pnpm test:coverage # Coverage report
\`\`\`

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality control

## 🗄 Database Schema

### Core Tables
- **profiles**: User account information
- **organizations**: Company/business data
- **customers**: Customer contact information
- **projects**: Job and project tracking
- **invoices**: Billing and payment data
- **estimates**: Quote and proposal system
- **tasks**: Work item management
- **communications**: Interaction history

### Relationships
- Users belong to Organizations
- Customers belong to Organizations
- Projects belong to Customers
- Invoices belong to Projects
- Tasks belong to Projects

## 🎯 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component-level lazy loading
- **Bundle Analysis**: Webpack bundle analyzer

### Backend Optimization
- **Database Indexing**: Optimized query performance
- **Caching**: Redis-based caching layer
- **CDN**: Static asset delivery
- **API Optimization**: Efficient data fetching

## 🧪 Testing Strategy

### Testing Types
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and database testing
- **E2E Tests**: Full user journey testing
- **Performance Tests**: Load and stress testing

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **MSW**: API mocking

## 🤝 Contributing

### Development Workflow
1. **Fork Repository**
2. **Create Feature Branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Make Changes**
4. **Run Tests**
   \`\`\`bash
   pnpm test
   \`\`\`
5. **Commit Changes**
   \`\`\`bash
   git commit -m 'Add amazing feature'
   \`\`\`
6. **Push to Branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
7. **Open Pull Request**

### Code Standards
- Follow TypeScript best practices
- Use meaningful variable names
- Write comprehensive tests
- Document complex functions
- Follow existing code patterns

## 📞 Support

### Documentation
- **API Documentation**: `/docs/api`
- **Component Library**: `/docs/components`
- **Database Schema**: `/docs/database`
- **Deployment Guide**: `/docs/deployment`

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community support and questions
- **Email Support**: support@redfoxcrm.com
- **Documentation**: Comprehensive guides and tutorials

### Community
- **Discord**: Real-time community chat
- **Twitter**: Updates and announcements
- **Blog**: Technical articles and tutorials
- **Newsletter**: Monthly product updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: Amazing React framework
- **Supabase Team**: Excellent backend-as-a-service
- **shadcn**: Beautiful UI component library
- **Vercel**: Seamless deployment platform
- **Open Source Community**: Countless helpful libraries

---

**Built with ❤️ by the RedFox CRM Team**

For more information, visit our [website](https://redfoxcrm.com) or check out our [documentation](https://docs.redfoxcrm.com).
