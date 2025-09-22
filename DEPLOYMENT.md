# CalmRush Deployment Guide

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
1. GitHub repository with your code
2. Vercel account (free)
3. Database (PostgreSQL)

### Step 1: Prepare Environment Variables
Create a `.env.local` file with:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/calmrush"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Add environment variables in Vercel dashboard
6. Deploy!

### Step 3: Set Up Database
**Option A: Vercel Postgres**
1. In Vercel dashboard → Storage → Create Postgres
2. Copy connection string to environment variables

**Option B: External Database**
- [Supabase](https://supabase.com) (free tier available)
- [PlanetScale](https://planetscale.com) (free tier available)
- [Railway](https://railway.app) (free tier available)

### Step 4: Run Database Migrations
After deployment, run:
```bash
npx prisma migrate deploy
```

## 🔧 Alternative Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

### Railway
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

### Self-Hosted VPS
1. Install Node.js and PM2
2. Clone repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start: `pm2 start npm --name "calmrush" -- start`

## 📋 Pre-Deployment Checklist

- [ ] Code committed to Git
- [ ] Environment variables configured
- [ ] Database set up and accessible
- [ ] Build passes: `npm run build`
- [ ] All features tested locally
- [ ] Domain configured (if using custom domain)

## 🐛 Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure DATABASE_URL is correct
2. **Build Errors**: Check for TypeScript errors
3. **Environment Variables**: Verify all required vars are set
4. **CORS Issues**: Check NextAuth configuration

### Support:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Prisma: [prisma.io/docs](https://prisma.io/docs)



