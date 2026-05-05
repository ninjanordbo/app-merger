import { v4 } from "uuid";

type Notification = {
  id: string;
  type: "success" | "warning" | "error";
  title: string;
  message: string;
};

const NOTIFICATION_TIMEOUT = 5000;

export const useNotifications = defineStore("notifications", () => {
  const notifications = ref<Notification[]>([]);

  function pushNotification(notification: Omit<Notification, "id">) {
    const newId = v4();
    notifications.value.push({ id: newId, ...notification });
    setTimeout(() => {
      removeNotification(newId);
    }, NOTIFICATION_TIMEOUT);
  }
  function removeNotification(id: string) {
    return notifications.value.find((notification, index) => {
      if (notification.id === id) {
        notifications.value.splice(index, 1);
        return true;
      }
      return false;
    });
  }

  return {
    notifications,

    pushNotification,
    removeNotification,
  };
});
