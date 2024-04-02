import fs from 'fs';
import { writeFile } from 'fs/promises';

async function saveToFileSystemWithStream(filePath: string, file: File) {
  const writeStream = fs.createWriteStream(filePath);

  const reader = file.stream().getReader();

  let done = false;
  while (!done) {
    const { value, done: doneValue } = await reader.read();
    done = doneValue;
    if (value) {
      console.log('Writing chunk of size: ', value.byteLength);
      writeStream.write(Buffer.from(value));
    }
  }

  writeStream.end();
}

async function saveToFileSystemWithBuffer(filePath: string, file: File) {
  const buffer = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(buffer));
}

export { saveToFileSystemWithStream, saveToFileSystemWithBuffer };
