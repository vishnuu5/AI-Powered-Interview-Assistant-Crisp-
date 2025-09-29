import { persistor } from "../store";

export const clearAllData = async () => {
  try {
    // Purge all persisted data
    await persistor.purge();
    localStorage.removeItem("persist:crisp-ai");
    window.location.reload();
  } catch (error) {
    console.error("Error clearing data:", error);
    // Fallback: clear localStorage manually
    localStorage.clear();
    window.location.reload();
  }
};

export const clearSessionData = () => {
  localStorage.removeItem("persist:crisp-ai");
  window.location.reload();
};
