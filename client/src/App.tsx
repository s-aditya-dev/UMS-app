import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import "./scss/global.scss";

import { Auth, LoginForm } from "./pages/auth/";
import { Panel } from "./pages/panel/";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Outlet />,
      children: [
        {
          path: "/",
          element: <LoginForm />,
        },
        {
          path: "/auth/*",
          element: <Auth />,
        },
        {
          path: "/panel/*",
          element: <Panel />,
        },
        {
          path: "/*",
          element: (
            <div className="h-svh w-full grid place-items-center">
              <h1>404</h1>
            </div>
          ),
        },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
