import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/types';

contextBridge.exposeInMainWorld('convertique', {
  selectFiles: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_FILES),
  selectDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_DIRECTORY),
  getSystemInfo: () => ipcRenderer.invoke(IPC_CHANNELS.GET_SYSTEM_INFO),
  convertStart: (tasks: unknown[]) =>
    ipcRenderer.invoke(IPC_CHANNELS.CONVERT_START, tasks),
  convertCancel: (id: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CONVERT_CANCEL, id),
  getDefaultConfig: () => ipcRenderer.invoke(IPC_CHANNELS.GET_DEFAULT_CONFIG),
  validateConfig: (config: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.VALIDATE_CONFIG, config),
  getFbcVersion: () => ipcRenderer.invoke(IPC_CHANNELS.GET_FBC_VERSION),
  openPath: (path: string) => ipcRenderer.invoke(IPC_CHANNELS.OPEN_PATH, path),
  onConvertProgress: (
    callback: (data: { id: string; status: string }) => void,
  ) => {
    const handler = (_event: Electron.IpcRendererEvent, data: unknown) => {
      callback(data as { id: string; status: string });
    };
    ipcRenderer.on(IPC_CHANNELS.CONVERT_PROGRESS, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.CONVERT_PROGRESS, handler);
  },
  onConvertResult: (
    callback: (data: unknown) => void,
  ) => {
    const handler = (_event: Electron.IpcRendererEvent, data: unknown) => {
      callback(data);
    };
    ipcRenderer.on(IPC_CHANNELS.CONVERT_RESULT, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.CONVERT_RESULT, handler);
  },
});