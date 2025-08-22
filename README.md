# RedFox CRM - Customer Relationship Management System

A modern CRM system built with Next.js 15, React 19, and Supabase for outdoor lighting, landscaping, and irrigation businesses.

## 🚀 Features

- **Customer Management**: Track and manage customer information, contacts, and communication history
- **Project Management**: Create, track, and manage projects with progress monitoring
- **Invoice Management**: Generate and manage invoices with automated calculations
- **Dashboard Analytics**: Real-time insights and reporting
- **Mobile Responsive**: Fully responsive design for all devices
- **Authentication**: Secure login with Google OAuth and email/password
- **Admin Panel**: Administrative dashboard for system management

## 🔧 Tech Stack

- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18.18.0 or higher
- pnpm (recommended) or npm
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Fuzzybob4/RedfoxCRM.git
cd RedfoxCRM
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your `.env.local` file with your Supabase credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

5. Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Login Information

### Admin Access

**Admin Dashboard**: `/admin/login`

- **Username**: `admin`
- **Password**: `redfox2024!`

The admin panel allows you to:
- View system statistics and health
- Manage users and view their dashboards
- Access system settings
- Monitor recent activities
- View and edit any user's dashboard

### Demo User Accounts

For testing and demonstration purposes, you can use these demo accounts:

#### Demo User 1
- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Dashboard**: `/dashboard/demo-user-123`
- **Features**: Full customer management, project tracking, invoice generation

#### Demo User 2 (John Doe)
- **Email**: `john@example.com`
- **Password**: `john123`
- **Dashboard**: `/dashboard/john-doe-456`
- **Features**: Active projects, customer base, revenue tracking

#### Demo User 3 (Jane Smith)
- **Email**: `jane@example.com`
- **Password**: `jane123`
- **Dashboard**: `/dashboard/jane-smith-789`
- **Features**: Landscape design projects, irrigation systems

### Google OAuth

You can also sign in using Google OAuth. The system will automatically create a user account and redirect to the appropriate dashboard.

## 📊 Admin Features

As an admin, you can:

1. **View User Dashboards**: Click "View Dashboard" next to any user in the admin panel
2. **Edit Pages**: Access any protected page or dashboard for editing
3. **System Monitoring**: Monitor user activities, system health, and performance
4. **User Management**: View user statistics and manage accounts

## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── components/        # Shared components
│   ├── dashboard/         # User dashboards
│   ├── features/          # Feature pages
│   ├── industries/        # Industry-specific pages
│   └── api/              # API routes
├── components/            # UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
├── public/               # Static assets
└── scripts/              # Database scripts
\`\`\`

## 🎨 Key Pages

- **Home**: `/` - Landing page with features and pricing
- **Features**: `/features` - Detailed feature showcase
- **Industries**: `/industries` - Industry-specific solutions
- **Pricing**: `/pricing` - Pricing plans and packages
- **Login**: `/login` - User authentication
- **Dashboard**: `/dashboard` - User dashboard (protected)
- **Admin**: `/admin` - Administrative panel

## 🔒 Authentication Flow

1. **Public Access**: Home, features, industries, pricing pages
2. **Protected Routes**: Dashboard, customer management, projects, invoices
3. **Admin Routes**: Admin panel, user management, system settings
4. **Middleware**: Automatic redirection based on authentication status

## 🛠️ Development

### Available Scripts

\`\`\`bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm type-check
\`\`\`

### Database Setup

The project includes SQL scripts in the `scripts/` directory:

- `create-complete-schema.sql` - Complete database schema
- `create-onboarding-tables.sql` - Onboarding flow tables
- `fix-rls-policies.sql` - Row Level Security policies

## 🚀 Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📝 Environment Variables

Required environment variables:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Site Configuration
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DOMAIN=

# Email (Optional)
EMAIL_SERVER=
EMAIL_FROM=
SENDGRID_API_KEY=
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Contact: support@redfoxcrm.com
- Documentation: [docs.redfoxcrm.com](https://docs.redfoxcrm.com)

## 🔄 Version History

- **v1.0.0** - Initial release with core CRM features
- **v1.1.0** - Added admin panel and user management
- **v1.2.0** - Enhanced dashboard analytics and reporting
- **v1.3.0** - Mobile responsiveness improvements

---

**RedFox CRM** - Streamlining customer relationships for outdoor service businesses.
