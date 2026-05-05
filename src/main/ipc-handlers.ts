import { ipcMain, dialog, shell, app } from 'electron';
import path from 'path';
import { IPC_CHANNELS, SystemInfo } from '../shared/types';

function getFbcBinaryPath(): string {
  const ext = process.platform === 'win32' ? '.exe' : '';
  const appPath = app.isPackaged
    ? path.join(process.resourcesPath, 'bin')
    : path.join(app.getAppPath(), 'bin');
  return path.join(appPath, `fbc${ext}`);
}

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.SELECT_FILES, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'FB2 Books', extensions: ['fb2'] },
        { name: 'Archives', extensions: ['zip'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    return result;
  });

  ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    });
    return result;
  });

  ipcMain.handle(IPC_CHANNELS.GET_SYSTEM_INFO, async (): Promise<SystemInfo> => {
    return {
      platform: process.platform,
      arch: process.arch,
      fbcPath: getFbcBinaryPath(),
    };
  });

  ipcMain.handle(IPC_CHANNELS.OPEN_PATH, async (_event, filePath: string) => {
    await shell.openPath(filePath);
  });
}