import { supabase } from '../supabase/client';

async function uploadFileToSupabase(file: File) {
  const { data, error } = await supabase.storage.from('user-files').upload(file.name, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw error;
  }
  return data;
}

export { uploadFileToSupabase };
