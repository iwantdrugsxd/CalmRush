const { execSync } = require('child_process');
const path = require('path');

async function buildProduction() {
  try {
    console.log('🚀 Starting production build...');
    
    // Check if DATABASE_URL is available
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    console.log('Database URL available:', hasDatabaseUrl);
    
    // Always generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Only run db push if DATABASE_URL is available
    if (hasDatabaseUrl) {
      console.log('🗄️ Pushing database schema...');
      execSync('npx prisma db push', { stdio: 'inherit' });
    } else {
      console.log('⚠️ Skipping database push - no DATABASE_URL provided');
    }
    
    // Build Next.js app
    console.log('🏗️ Building Next.js application...');
    execSync('npx next build --turbopack', { stdio: 'inherit' });
    
    console.log('✅ Production build completed successfully!');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildProduction();
