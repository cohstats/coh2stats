import { app, dialog } from "electron"
import path from "path";

export const locateWarningsFile = () => {
  const location = dialog.showOpenDialog({
    title: "Locate warnings.log",
    defaultPath: path.resolve(app.getPath('documents'), 'My Games', 'Company of Heroes 2', 'warnings.log'),
    buttonLabel: 'Locate',
    properties: [ 'openFile', 'dontAddToRecent'],
    message: "If Coh2 is installed and has been executed once the warnings.logs should appear in Documents/My Games/Company of Heroes2"
  });
}
