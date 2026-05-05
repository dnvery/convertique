import { ChildProcess, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getFbcBinaryPath } from './binary-resolver';
import { configManager } from './config-manager';
import { ConversionTask, ConversionResult, FbcConfig } from '../shared/types';

const runningProcesses = new Map<string, ChildProcess>();

export async function startConversion(
  tasks: ConversionTask[],
  config: FbcConfig,
  onProgress: (id: string, status: string) => void,
  onResult: (result: ConversionResult) => void,
): Promise<void> {
  const fbcPath = getFbcBinaryPath();
  if (!fs.existsSync(fbcPath)) {
    tasks.forEach((task) => {
      onResult({ id: task.id, status: 'error', error: 'fbc binary not found' });
    });
    return;
  }

  const configPath = await configManager.writeTempConfig(config);

  for (const task of tasks) {
    const destinationDir = task.destinationPath || path.dirname(task.sourcePath);
    const baseName = path.basename(task.sourcePath, path.extname(task.sourcePath));
    const outputExt = getOutputExtension(task.format);
    const outputPath = path.join(destinationDir, `${baseName}.${outputExt}`);

    const args = buildArgs(task, configPath);

    onProgress(task.id, 'converting');

    try {
      const result = await runFbc(fbcPath, args);
      runningProcesses.set(task.id, result.process);

      const fullOutput = result.stdout + result.stderr;
      const hasError = result.exitCode !== 0 || fullOutput.toLowerCase().includes('error');

      if (hasError) {
        onResult({
          id: task.id,
          status: 'error',
          outputPath: hasError ? undefined : outputPath,
          error: result.stderr || result.stdout || 'Conversion failed',
          duration: result.duration,
        });
      } else {
        onResult({
          id: task.id,
          status: 'done',
          outputPath,
          duration: result.duration,
        });
      }

      runningProcesses.delete(task.id);
    } catch (err) {
      onResult({
        id: task.id,
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  try {
    fs.unlinkSync(configPath);
  } catch {
    // ignore cleanup
  }
}

function getOutputExtension(format: ConversionTask['format']): string {
  const map = {
    epub2: 'epub',
    epub3: 'epub',
    kepub: 'epub',
    kfx: 'kfx',
    azw8: 'azw8',
  };
  return map[format] || 'epub';
}

function buildArgs(task: ConversionTask, configPath: string): string[] {
  const args = ['convert', '-c', configPath];

  args.push('--overwrite');
  if (task.noDirs) args.push('--no-dirs');
  if (task.forceZipCp) args.push('--force-zip-cp', task.forceZipCp);
  if (task.asin) args.push('--asin', task.asin);
  if (task.ebook) args.push('--ebook');
  if (task.format) args.push('--to', task.format);

  args.push(task.sourcePath);

  if (task.destinationPath) {
    args.push(task.destinationPath);
  }

  return args;
}

function runFbc(
  fbcPath: string,
  args: string[],
): Promise<{ process: ChildProcess; stdout: string; stderr: string; exitCode: number; duration: number }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';

    const proc = spawn(fbcPath, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: false,
    });

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({
        process: proc,
        stdout,
        stderr,
        exitCode: code ?? 0,
        duration: Date.now() - startTime,
      });
    });

    proc.on('error', (err) => {
      stderr += err.message;
      proc.kill();
    });
  });
}

export function cancelConversion(id: string): boolean {
  const proc = runningProcesses.get(id);
  if (proc) {
    proc.kill('SIGTERM');
    runningProcesses.delete(id);
    return true;
  }
  return false;
}