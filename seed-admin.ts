import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@getlegalsolution.com' },
    update: { 
      passwordHash, 
      role: 'ULTIMATE_ADMIN' 
    },
    create: {
      email: 'admin@getlegalsolution.com',
      passwordHash,
      name: 'Ultimate Admin',
      role: 'ULTIMATE_ADMIN'
    }
  });

  console.log('Created admin:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
