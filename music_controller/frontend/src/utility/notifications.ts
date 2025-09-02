import { createContext, useContext } from "react";
export interface Notification {
  message: string;
}

// Notification Context
export interface NotificationContextProps {
  addNotification: (notification: Notification) => void;
}

// // Notification Provider
// export interface NotificationProviderProps {
//   children: React.ReactNode;
// }

export const NotificationContext = createContext<NotificationContextProps>({
  addNotification() {
    /* default empty */
  },
});

const useNotifications = (): NotificationContextProps =>
  useContext(NotificationContext) as NotificationContextProps;

export default useNotifications;
