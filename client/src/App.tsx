import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";

import './scss/global.scss'

import {Home} from './pages/home/home';
import { LoginForm } from "./pages/auth/login";
import { Panel } from "./pages/panel/panel";


// Initialize QueryClient
const queryClient = new QueryClient();

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Outlet />,
      children: [
        {
          path: "/",
          element: <LoginForm/>,
        },
        {
          path: "/home",
          element: <Home/>,
        },
        {
          path: "/login",
          element: <LoginForm />,
        },
        {
          path: "/panel/*",
          element: <Panel />,
        },
        {
          path: "/mode",
          element: <div className='h-screen w-ful grid place-items-center'>
          </div>,
        },
        {
          path: "/*",
          element: <h1>404</h1>,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
