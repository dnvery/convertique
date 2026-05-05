{ pkgs ? import <nixpkgs> {} }:

let
  electronPkg = pkgs.electron;

  runtimeLibs = with pkgs; [
    alsa-lib
    atk
    at-spi2-atk
    at-spi2-core
    cairo
    cups
    dbus
    expat
    fontconfig
    freetype
    gdk-pixbuf
    glib
    gtk3
    harfbuzz
    libdrm
    libgbm
    libGL
    libgcc
    libnotify
    libuuid
    libxkbcommon
    libX11
    libXcomposite
    libXcursor
    libXdamage
    libXext
    libXfixes
    libXi
    libxrandr
    libXrender
    libXScrnSaver
    libxtst
    libxcb
    mesa
    nspr
    nss
    pango
    systemd
    zlib
  ];

  # Extract env vars from the nixpkgs electron wrapper so we can set them
  # for the npm-installed electron binary
  electronWrapper = pkgs.runCommand "electron-env" { } ''
    cat ${electronPkg}/bin/electron > $out
  '';

in pkgs.mkShell {
  name = "convertique";

  buildInputs = with pkgs; [
    nodejs_22
    patchelf
    xdg-desktop-portal
    xdg-desktop-portal-gtk
  ] ++ runtimeLibs;

  LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath runtimeLibs;

  # Pass through env vars from the nixpkgs electron wrapper
  GIO_EXTRA_MODULES = "${pkgs.dconf.lib}/lib/gio/modules";
  GDK_PIXBUF_MODULE_FILE = "${pkgs.librsvg}/lib/gdk-pixbuf-2.0/2.10.0/loaders.cache";
  XDG_DATA_DIRS = "${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.dconf}/share/gsettings-schemas/${pkgs.dconf.name}";
  CHROME_DEVEL_SANDBOX = "${electronPkg}/libexec/electron/chrome-sandbox";

  shellHook = ''
    # Patch npm-installed electron to use the NixOS dynamic linker
    local ELECTRON_BIN="node_modules/electron/dist/electron"
    if [ -f "$ELECTRON_BIN" ]; then
      local INTERP="${pkgs.stdenv.cc.bintools.dynamicLinker}"
      local CURRENT=$(patchelf --print-interpreter "$ELECTRON_BIN" 2>/dev/null || echo "")
      if [ "$CURRENT" != "$INTERP" ]; then
        echo "[convertique] Patching Electron interpreter -> $INTERP"
        patchelf --set-interpreter "$INTERP" "$ELECTRON_BIN"
      fi
    fi

    echo "[convertique] Dev shell ready."
    echo "  Node: $(node --version)"
    echo "  NPM:  $(npm --version)"
    echo ""
    echo "  Run 'npm start' to launch the app."
  '';
}