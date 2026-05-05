import { app } from 'electron';
import path from 'path';
import { execFile } from 'child_process';
import fs from 'fs';

const FBC_VERSION = fs.readFileSync(
  path.join(__dirname, '../../bin/VERSION'),
  'utf8',
).trim();

export function getFbcBinaryPath(): string {
  const ext = process.platform === 'win32' ? '.exe' : '';
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'bin', `fbc${ext}`);
  }
  return path.join(app.getAppPath(), 'bin', `fbc${ext}`);
}

export async function getFbcVersion(): Promise<string | undefined> {
  const fbcPath = getFbcBinaryPath();
  if (!fs.existsSync(fbcPath)) {
    return undefined;
  }
  return new Promise((resolve) => {
    execFile(fbcPath, ['--version'], { timeout: 5000 }, (err, stdout) => {
      if (err) {
        resolve(undefined);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

export async function isFbcAvailable(): Promise<boolean> {
  const fbcPath = getFbcBinaryPath();
  if (!fs.existsSync(fbcPath)) {
    return false;
  }
  const version = await getFbcVersion();
  return version !== undefined;
}

export { FBC_VERSION };