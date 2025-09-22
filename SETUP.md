# ZenFlow Setup Guide

## Database Setup

### 1. Install PostgreSQL
- Install PostgreSQL on your system
- Create a database named `zenflow`

### 2. Environment Variables
Create a `.env.local` file in the root directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zenflow?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### 4. Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the Application
```bash
npm run dev
```

## Features

### Authentication
- Google OAuth login
- Protected routes (playground, history)
- Session management

### Database Schema
- **Users**: Store user information from Google OAuth
- **Thoughts**: Store floating thoughts with positions and sentiment
- **ThoughtHistory**: Store problem-solution pairs with timestamps

### Pages
- **Login** (`/login`): Google OAuth login page
- **Playground** (`/playground`): Main thought processing interface
- **History** (`/history`): View all problems and solutions over time

### API Endpoints
- `GET/POST /api/thoughts`: Manage floating thoughts
- `GET/POST /api/thoughts/history`: Manage thought history
- `GET/POST /api/auth/[...nextauth]`: Authentication

## Database Recommendations

For production, consider:
- **PostgreSQL** (recommended): Great for relational data, JSON support
- **MongoDB**: If you prefer NoSQL
- **Supabase**: Managed PostgreSQL with built-in auth
- **PlanetScale**: MySQL-compatible serverless database

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically

### Database Hosting
- **Supabase**: Free tier available
- **Railway**: Easy PostgreSQL hosting
- **Neon**: Serverless PostgreSQL

## Security Notes
- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Enable HTTPS in production
- Regularly update dependencies
