/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAY4jo3wj5j_q4GSQgQGP9N_APkZaWQCWA",
  authDomain: "nestpay-c11bc.firebaseapp.com",
  projectId: "nestpay-c11bc",
  messagingSenderId: "835149202617",
  appId: "1:835149202617:web:efcef4a4960fd802090768",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 BG payload:", payload);

  const title = payload.data?.title || "NestPay";
  const body = payload.data?.body || "You have a new message";

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png", // MUST be absolute
    data: payload.data,
  });
});

//when click on notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  // eslint-disable-next-line no-undef
  event.waitUntil(clients.openWindow(url));
});
