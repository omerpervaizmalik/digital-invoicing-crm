const { createClient } = require('@supabase/supabase-js');

async function test() {
  const url = 'https://ikijtdjutbbzmdkussto.supabase.co';
  const key = 'sb_publishable_XwvS6K8aZzG8MVSDAaguaw_bMzSyI31';
  
  try {
    const supabase = createClient(url, key);
    const buffer = Buffer.from('test');
    
    const { data, error } = await supabase.storage
      .from('tenant-logos')
      .upload('test.txt', buffer, {
        contentType: 'text/plain',
        upsert: true
      });
      
    if (error) {
      console.error('Upload Error:', error);
    } else {
      console.log('Upload Success:', data);
    }
  } catch (err) {
    console.error('Client Error:', err);
  }
}

test();
