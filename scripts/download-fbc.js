#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const FBC_REPO = 'rupor-github/fb2cng';
const BIN_DIR = path.join(__dirname, '..', 'bin');

function getVersion() {
  const versionFile = path.join(BIN_DIR, 'VERSION');
  const version = fs.readFileSync(versionFile, 'utf8').trim();
  return version.startsWith('v') ? version : `v${version}`;
}

function getPlatformArch() {
  const platform = process.platform;
  const arch = process.arch;

  const osMap = { darwin: 'darwin', linux: 'linux', win32: 'windows' };
  const archMap = { x64: 'amd64', arm64: 'arm64', ia32: '386' };

  const os = osMap[platform];
  const cpu = archMap[arch];

  if (!os || !cpu) {
    console.error(`Unsupported platform: ${platform}-${arch}`);
    process.exit(1);
  }

  return { os, cpu, suffix: `fbc-${os}-${cpu}.zip` };
}

async function downloadFile(url, dest) {
  const { execSync } = require('child_process');
  console.log(`[download-fbc] Downloading with curl...`);
  execSync(`curl -sL -o "${dest}" "${url}"`, { stdio: 'inherit' });
  if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) {
    throw new Error(`Failed to download ${url}`);
  }
}

async function main() {
  const version = getVersion();
  const { os, suffix } = getPlatformArch();

  const downloadUrl = `https://github.com/${FBC_REPO}/releases/download/${version}/${suffix}`;
  const zipPath = path.join(BIN_DIR, suffix);
  const binaryName = os === 'windows' ? 'fbc.exe' : 'fbc';

  console.log(`[download-fbc] Downloading fbc ${version} for ${os}...`);
  console.log(`[download-fbc] URL: ${downloadUrl}`);

  await downloadFile(downloadUrl, zipPath);
  console.log(`[download-fbc] Downloaded to ${zipPath}`);

  console.log(`[download-fbc] Extracting...`);
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(BIN_DIR, true);

  const binaryPath = path.join(BIN_DIR, binaryName);
  if (os !== 'windows') {
    fs.chmodSync(binaryPath, 0o755);
  }

  fs.unlinkSync(zipPath);

  console.log(`[download-fbc] fbc ${version} installed to ${binaryPath}`);

  const { execSync } = require('child_process');
  try {
    const ver = execSync(`"${binaryPath}" --version`, { encoding: 'utf8' }).trim();
    console.log(`[download-fbc] Verified: ${ver}`);
  } catch {
    console.warn(`[download-fbc] Warning: Could not verify binary version`);
  }
}

main().catch((err) => {
  console.error(`[download-fbc] Error: ${err.message}`);
  process.exit(1);
});