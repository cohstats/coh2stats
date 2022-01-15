import { app, Menu, Tray } from 'electron';
import { showNotification } from './notification';
import { getIconPath } from './paths';
import { openMatchWindow, openSettingsWindow, openWebWindow } from './windows';

let tray: null | Tray = null;
let quitApplication = false;

export const createTrayIcon = () => {
  tray = new Tray(getIconPath());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Notification Text',
      click: () => {
        showNotification("Coh2 Stats", "Coh2 match starts");
      }
    },
    {
      label: 'Logs & Stats',
      click: () => {
        openWebWindow("https://coh2stats.com/stats");
      }
    },
    {
      label: 'Settings',
      click: () => {
        openSettingsWindow();
      }
    },
    {
      label: 'Exit',
      click: ExitApplication
    }
  ]);
  tray.on('click', () => {
    openMatchWindow();
  });
  tray.setToolTip('Tray Test');
  tray.setContextMenu(contextMenu);
}

export const ExitApplication = () => {
  quitApplication = true;
  app.quit();
}

export const isQuitting = () => {
  return quitApplication;
}
