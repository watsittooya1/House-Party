import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import {
  type Notification,
  NotificationContext,
} from "../utility/notifications";
import colorScheme from "../utility/colorScheme";

const SECONDS_TO_DISPLAY_NOTIFICATION = 5;

const NotificationProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notification, setNotification] = useState<Notification>();

  const activeNotificationIds = notification;
  useEffect(() => {
    if (activeNotificationIds) {
      const timer = setTimeout(
        () => setNotification(undefined),
        SECONDS_TO_DISPLAY_NOTIFICATION * 1000
      );
      return (): void => clearTimeout(timer);
    }
  }, [activeNotificationIds]);

  return (
    <NotificationContext.Provider
      value={{
        addNotification: (notification: Notification): void =>
          setNotification(notification),
      }}
    >
      {children}
      {notification ? (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: colorScheme.darkGray,
              minWidth: "fit-content",
            },
          }}
          message={notification.message}
          open={true}
        />
      ) : undefined}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
