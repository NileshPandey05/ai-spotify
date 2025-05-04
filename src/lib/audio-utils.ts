import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { randomUUID } from 'crypto';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function createTempFiles(file1: File, file2: File) {
  const tempDir = path.join(process.cwd(), 'temp', randomUUID());
  await mkdir(tempDir, { recursive: true });

  const tempFile1 = path.join(tempDir, file1.name);
  const tempFile2 = path.join(tempDir, file2.name);

  const buffer1 = await file1.arrayBuffer();
  const buffer2 = await file2.arrayBuffer();

  await writeFile(tempFile1, Buffer.from(buffer1));
  await writeFile(tempFile2, Buffer.from(buffer2));

  return { tempFile1, tempFile2, tempDir };
}

export async function createTempDir() {
  const tempDir = path.join(process.cwd(), 'temp', randomUUID());
  await mkdir(tempDir, { recursive: true });
  return tempDir;
}

export async function cleanupTempFiles(tempDir: string) {
  // In a real implementation, you would delete the temp files
  // For now, we'll just leave them for debugging
  console.log(`Temp files kept at: ${tempDir}`);
}