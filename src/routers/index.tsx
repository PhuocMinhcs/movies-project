import { createBrowserRouter } from "react-router-dom";
import PageWrapper from "../components/PageWrapper/PageWrapper";
import Home from "../pages/Home/Home";
import ErrorBoundary from "../components/ErrorBoundary";
import NotFound from "../pages/NotFound/NotFound";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <PageWrapper />,
    // element: <Home />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
    ],
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routers;
