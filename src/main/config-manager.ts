import { execFile } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import yaml from 'js-yaml';
import { getFbcBinaryPath } from './binary-resolver';
import { FbcConfig, getDefaultConfig } from '../shared/types';

export class ConfigManager {
  async getDefaults(): Promise<FbcConfig> {
    const fbcPath = getFbcBinaryPath();
    if (!fs.existsSync(fbcPath)) {
      return getDefaultConfig();
    }

    return new Promise<FbcConfig>((resolve) => {
      const tmpFile = path.join(os.tmpdir(), `convertique-defaults-${Date.now()}.yaml`);
      execFile(
        fbcPath,
        ['dumpconfig', '--default', tmpFile],
        { timeout: 10000 },
        (err) => {
          if (err) {
            resolve(getDefaultConfig());
            return;
          }
          try {
            const content = fs.readFileSync(tmpFile, 'utf8');
            const config = yaml.load(content) as FbcConfig;
            resolve(config);
          } catch {
            resolve(getDefaultConfig());
          } finally {
            try {
              fs.unlinkSync(tmpFile);
            } catch {
              // ignore cleanup errors
            }
          }
        },
      );
    });
  }

  async validateConfig(configYaml: string): Promise<{ valid: boolean; errors: string[] }> {
    const fbcPath = getFbcBinaryPath();
    if (!fs.existsSync(fbcPath)) {
      return { valid: false, errors: ['fbc binary not found'] };
    }

    return new Promise((resolve) => {
      const tmpFile = path.join(os.tmpdir(), `convertique-validate-${Date.now()}.yaml`);
      fs.writeFileSync(tmpFile, configYaml, 'utf8');

      execFile(fbcPath, ['-c', tmpFile, 'dumpconfig'], { timeout: 10000 }, (err, _stdout, stderr) => {
        try {
          fs.unlinkSync(tmpFile);
        } catch {
          // ignore cleanup errors
        }

        if (err) {
          const errorMessage = stderr || err.message;
          const lines = errorMessage.split('\n').filter((l: string) => l.trim());
          resolve({ valid: false, errors: lines });
          return;
        }
        resolve({ valid: true, errors: [] });
      });
    });
  }

  async writeTempConfig(config: FbcConfig): Promise<string> {
    const configYaml = yaml.dump(config, { lineWidth: -1 });
    const tmpFile = path.join(os.tmpdir(), `convertique-config-${Date.now()}.yaml`);
    fs.writeFileSync(tmpFile, configYaml, 'utf8');
    return tmpFile;
  }
}

export const configManager = new ConfigManager();