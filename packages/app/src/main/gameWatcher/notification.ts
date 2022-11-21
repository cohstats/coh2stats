import { Notification } from "electron";
import path from "path";
import { isPackaged } from "electron-is-packaged";
import sound from "sound-play";

export const notifyGameFound = (): void => {
  new Notification({
    title: "Found a Game",
    body: "You are joining a game in Coh2",
  }).show();
};

export const notifySoundGameFound = (volume: number): void => {
  const fileName = "hoorah.wav";

  let fullPath = path.join(__dirname, `../../assets/${fileName}`);

  if (isPackaged) {
    // In asar the file is in different location
    fullPath = path.join(__dirname, `../../../assets/${fileName}`);
  }

  let finalVolume = 50;
  if (volume > 1) {
    finalVolume = volume / 100;
  }

  sound.play(fullPath, finalVolume);
  console.log("Playing notification sound");
};
