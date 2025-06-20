import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router/index";
import { Provider } from "react-redux";
import { reduxStore } from "../redux/index";

const router = createBrowserRouter(routes);

const App = () => {
  return (
    <Provider store={reduxStore}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
