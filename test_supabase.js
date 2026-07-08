import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.replace('\r', '').match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

async function test() {
  const { data: bracket, error: fetchError } = await supabase
    .from('bracket')
    .select('*')
    .limit(1)
    .single();

  console.log("Fetch bracket:", bracket, fetchError);

  if (bracket) {
    const { data: updated, error: updateError } = await supabase
      .from('bracket')
      .update({ does_not_exist_col: true })
      .eq('id', bracket.id)
      .select()
      .single();
    
    console.log("Update non-existent col:", updated, updateError);
  }
}

test();
