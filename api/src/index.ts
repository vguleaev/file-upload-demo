import { serve } from '@hono/node-server';
import { Hono, Context } from 'hono';
import { writeFile } from 'fs/promises';

const app = new Hono();

app.get('/', (c: Context) => {
  return c.text('Hello Hono!');
});

app.post('/api/upload', async (c: Context) => {
  const formData = await c.req.formData();
  const file = formData.get('file') as File;

  if (file) {
    const filePath = `./upload/${file.name}`;
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));
    return c.text(filePath);
  } else {
    return c.text('No file found in request');
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
