#!/usr/bin/env bash
set -euo pipefail

# On NixOS, patch the npm-installed Electron binary to use the correct
# dynamic linker. The nix-shell / flake.nix dev shell handles this
# automatically via shellHook, but this script runs as npm postinstall
# for cases where the dev shell is not used (e.g., CI on NixOS).

if [[ "$(uname)" != "Linux" ]]; then
  exit 0
fi

if [[ ! -f /etc/os/release ]] || ! grep -qi "NixOS" /etc/os-release; then
  exit 0
fi

ELECTRON_BIN="node_modules/electron/dist/electron"

if [[ ! -f "$ELECTRON_BIN" ]]; then
  exit 0
fi

if command -v patchelf &>/dev/null; then
  # Find the system dynamic linker from the Nix store
  INTERP=$(find /nix/store -maxdepth 3 -name "ld-linux-x86-64.so.2" 2>/dev/null | grep "glibc" | head -1 || true)
  if [[ -z "$INTERP" ]]; then
    INTERP="/lib64/ld-linux-x86-64.so.2"
  fi

  CURRENT=$(patchelf --print-interpreter "$ELECTRON_BIN" 2>/dev/null || echo "")
  if [[ "$CURRENT" != "$INTERP" ]]; then
    echo "[convertique] Patching Electron interpreter for NixOS -> $INTERP"
    patchelf --set-interpreter "$INTERP" "$ELECTRON_BIN"
    echo "[convertique] Done."
  fi
fi