import { ipcMain, dialog, shell, BrowserWindow } from 'electron';
import { IPC_CHANNELS, SystemInfo, ConversionTask, FbcConfig } from '../shared/types';
import { getFbcBinaryPath, getFbcVersion, isFbcAvailable } from './binary-resolver';
import { configManager } from './config-manager';
import { startConversion, cancelConversion } from './conversion-manager';

let mainWindow: BrowserWindow | null = null;

export function setMainWindow(win: BrowserWindow): void {
  mainWindow = win;
}

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.SELECT_FILES, async () => {
    return dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'FB2 Books', extensions: ['fb2'] },
        { name: 'Archives', extensions: ['zip'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
  });

  ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async () => {
    return dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    });
  });

  ipcMain.handle(IPC_CHANNELS.GET_SYSTEM_INFO, async (): Promise<SystemInfo> => {
    const available = await isFbcAvailable();
    return {
      platform: process.platform,
      arch: process.arch,
      fbcPath: getFbcBinaryPath(),
      fbcVersion: available ? await getFbcVersion() : undefined,
    };
  });

  ipcMain.handle(IPC_CHANNELS.GET_DEFAULT_CONFIG, async () => {
    return configManager.getDefaults();
  });

  ipcMain.handle(IPC_CHANNELS.VALIDATE_CONFIG, async (_event, configYaml: string) => {
    return configManager.validateConfig(configYaml);
  });

  ipcMain.handle(IPC_CHANNELS.OPEN_PATH, async (_event, filePath: string) => {
    await shell.openPath(filePath);
  });

  ipcMain.handle(
    IPC_CHANNELS.CONVERT_START,
    async (_event, tasks: ConversionTask[], config: FbcConfig) => {
      if (!mainWindow) return;

      await startConversion(
        tasks,
        config,
        (id, status) => {
          mainWindow?.webContents.send(IPC_CHANNELS.CONVERT_PROGRESS, { id, status });
        },
        (result) => {
          mainWindow?.webContents.send(IPC_CHANNELS.CONVERT_RESULT, result);
        },
      );
    },
  );

  ipcMain.handle(IPC_CHANNELS.CONVERT_CANCEL, async (_event, id: string) => {
    cancelConversion(id);
  });
}