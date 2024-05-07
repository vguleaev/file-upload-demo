import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono, Context } from 'hono';
import { saveToFileSystemWithStream } from './services/file-system-upload.service';
import { uploadFileToSupabase } from './services/supabase-upload.service';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/', (c: Context) => {
  return c.text('Hello Hono!');
});

app.post('/api/upload', async (c: Context) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  try {
    if (file) {
      const response = await uploadFileToSupabase(file);
      console.log('File uploaded to Supabase: ', response);
      return c.text('File uploaded to Supabase');
    } else {
      return c.text('No file found in request');
    }
  } catch (error) {
    console.error('Error uploading file: ', error);
    throw new Error('Error uploading file');
  }
});

const port = Number(process.env.PORT) || 3020;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
