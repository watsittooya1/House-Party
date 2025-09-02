import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router/index";
import { Provider } from "react-redux";
import { reduxStore } from "../redux/index";
import NotificationProvider from "./providers/NotificationProvider";
import { setFavicon } from "./utility/setFavicon";
import { setFullscreen } from "./utility/setFullscreen";

setFavicon();
setFullscreen();

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <Provider store={reduxStore}>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </Provider>
  );
};

export default App;
