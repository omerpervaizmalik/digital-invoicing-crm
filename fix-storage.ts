import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up Supabase Storage Bucket and RLS Policies...');

  // Ensure bucket exists and is public
  await prisma.$executeRawUnsafe(`
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('tenant-logos', 'tenant-logos', true) 
    ON CONFLICT (id) DO UPDATE SET public = true;
  `);

  // Drop existing policies just in case
  await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Public Access" ON storage.objects;`);
  await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Upload Access" ON storage.objects;`);
  await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Update Access" ON storage.objects;`);
  
  // Create open policies for the tenant-logos bucket
  await prisma.$executeRawUnsafe(`
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tenant-logos');
  `);
  
  await prisma.$executeRawUnsafe(`
    CREATE POLICY "Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tenant-logos');
  `);
  
  await prisma.$executeRawUnsafe(`
    CREATE POLICY "Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'tenant-logos');
  `);

  console.log('Storage successfully configured!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
