import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import "./scss/global.scss";

import { Home } from "./pages/home/home";
import { LoginForm } from "./pages/auth/login";
import { Panel } from "./pages/panel/panel";
import { ChangePass } from "./pages/auth/changePass";
import { RegisterForm } from "./pages/auth/register";

// Initialize QueryClient

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
          path: "/home",
          element: <Home />,
        },
        {
          path: "/login",
          element: <LoginForm />,
        },
        {
          path: "/change-password/:sessionId",
          element: <ChangePass />,
        },
        {
          path: "/register-user/:sessionId",
          element: <RegisterForm />,
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
