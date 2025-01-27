export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        type: "module",
      });

      console.log("Service Worker registered:", registration);

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener("statechange", () => {
          if (newWorker.state === "activated") {
            console.log("New Service Worker activated");
            window.location.reload(); // Refresh to apply updates
          }
        });
      });
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}
