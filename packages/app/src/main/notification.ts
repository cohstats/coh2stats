import { Notification } from "electron"

export const showNotification = (title: string, body: string) => {
  new Notification({ title: title , body: body}).show();
}
