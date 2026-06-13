const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@getlegalsolution.com';
  const password = 'ultimatepassword123';
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: 'Ultimate Admin',
        role: 'ULTIMATE_ADMIN',
      }
    });
    console.log('Ultimate Admin created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } else {
    console.log('Ultimate Admin already exists.');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
