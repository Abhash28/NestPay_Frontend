import { getToken } from "firebase/messaging";
import { messaging } from "../src/firebase";
import axios from "axios";

export const generateFcmToken = async (jwtToken) => {
  // 1. Ask permission (ONLY after user click)
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  // 2. Wait for service worker to be READY
  const registration = await navigator.serviceWorker.ready;

  // 3. Pass registration explicitly
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  console.log(" FCM Token:", token);

  if (!token) return;

  await axios.post(
    "https://nestpay-backend.onrender.com/api/notification/save-token",
    { token },
    {
      headers: { Authorization: `Bearer ${jwtToken}` },
    },
  );
};
