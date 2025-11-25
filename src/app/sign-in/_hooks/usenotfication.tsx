"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Notification, {
  NotificationType,
} from "../_components/Notification";

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationState {
  message: string;
  type: NotificationType;
  id: number;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id }]);
  };

  const hideNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const showSuccess = (message: string) => showNotification(message, "success");
  const showError = (message: string) => showNotification(message, "error");
  const showInfo = (message: string) => showNotification(message, "info");
  const showWarning = (message: string) => showNotification(message, "warning");

  const value: NotificationContextType = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export default useNotification;
