import { ScrollArea } from "@/components/ui/scroll-area";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/utils/Protected Route";
import * as React from "react";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

//Pages
import { Dashboard } from "@/pages/panel/dashboard";
import { Task } from "@/pages/panel/task";
import { UserDetails } from "@/pages/panel/user-details";
import { UserList } from "@/pages/panel/users";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  currContent: string;
  setPage: (page: string) => void;
}

const MainBody: React.FC<MainProps> = ({
  currContent,
  setPage,
  className,
  ...props
}) => {
  const Maintainance = () => <h1>{currContent}</h1>;

  // Hooks
  const { setBreadcrumbs } = useBreadcrumb();
  const location = useLocation();

  // Variable declarations
  const currPath = location.pathname.split("/");

  const NavRoutes: { [key: string]: string[] } = {
    Dashboard: ["dashboard"],
    Users: ["users"],
    Analytics: ["analytics"],
    "Client List": ["client-list", "client-details"],
    Form: ["form"],
    Task: ["task"],
    Reports: ["reports"],
    Inventory: ["inventory"],
    Pages: ["pages"],
    Settings: ["settings"],
  };

  const componentMapping: { [key: string]: JSX.Element } = {
    dashboard: <Dashboard />,
    analytics: <Maintainance />,
    "users/": <UserList />,
    "users/:pageno": <UserList />,
    "users/form": <Maintainance />,
    "users/:pageno/details/:id": <UserDetails />,
    "client-list/:pageno": <Maintainance />,
    "dump-client-list": <Maintainance />,
    "new-client-list": <Maintainance />,
    "new-client-form": <Maintainance />,
    "client-details/:pageno/:id": <Maintainance />,
    "client-details/:pageno/:id/remark/:remarkid": <Maintainance />,
    form: <h1>Form</h1>,
    task: <Task />,
    reports: <Maintainance />,
    inventory: <Maintainance />,
    pages: <Maintainance />,
    settings: <Maintainance />,
    "*": <h1>404</h1>,
  };

  // Utility Function
  const findMatchingKey = (
    currPath: string | undefined,
    NavRoutes: { [key: string]: string[] },
  ): string | undefined => {
    if (!currPath) return undefined;
    for (const key in NavRoutes) {
      if (NavRoutes[key].includes(currPath)) {
        return key;
      }
    }
    return undefined;
  };

  //useEffects
  useEffect(() => {
    const matchedKey = findMatchingKey(currPath[2], NavRoutes);
    if (matchedKey) {
      setPage(matchedKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPath]); // currPath is the only dependency, but exhaustive-deps might want other dependencies

  useEffect(() => {
    setBreadcrumbs([{ label: currContent }]);
  }, [setBreadcrumbs, currContent]);

  return (
    <ScrollArea className={cn("w-full", className)}>
      <main
        id="main-content"
        className="w-full h-full p-4 flex justify-center items-start"
        {...props}
      >
        <Routes>
          {Object.keys(componentMapping).map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute isAuthenticated={true}>
                  {componentMapping[path]}
                </ProtectedRoute>
              }
            />
          ))}
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={true}>
                {componentMapping["form"]}
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </ScrollArea>
  );
};

export { MainBody };
