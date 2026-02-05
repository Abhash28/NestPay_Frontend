import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

let isListenerAttached = false;

export const listenForegroundMessages = () => {
  if (isListenerAttached) return;
  isListenerAttached = true;

  onMessage(messaging, (payload) => {
    console.log("📩 FG payload:", payload);

    new Notification(payload.data.title || "NestPay", {
      body: payload.data.body || "You have a new message",
      icon: "/logo.png",
    });
  });
};
