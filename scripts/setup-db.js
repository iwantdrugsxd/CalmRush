const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database connection...');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Check if tables exist by trying to query users
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in database`);
    
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
