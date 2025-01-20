import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import { useCallback, useEffect, useState } from "react";
import styles from "../../scss/layout/AppLayout.module.scss";

// Panel Components
import { MainBody } from "./modules/main";
import { Nav } from "./modules/nav";
import { Sidebar } from "./modules/sidebar";

import { NavLinks } from "@/store/data/side-links";
// import { useHandleLogout } from "@/hooks/use-logout.ts";
import { useAuth } from "@/store/auth";

export const Panel = () => {
  // useStates
  const [currPage, setPage] = useState("Dashboard");

  //Hooks
  const { logout: handleLogout } = useAuth();
  // const handleLogout = useHandleLogout();
  const handleSetPage = useCallback((newPage: string) => {
    setPage(newPage);
  }, []);

  const { user: currUser, checkUser } = useAuth(false); // Disable automatic fetching

  useEffect(() => {
    if (!currUser) {
      checkUser(); // Manually check user when needed
    }
  }, [currUser, checkUser]);

  return (
    <BreadcrumbProvider>
      <div
        id="main-container"
        className={`bg-primary-foreground w-svw min-h-svh ${styles.AppLayout}`}
      >
        <Sidebar
          className={styles.AppSidebar}
          NavLinks={NavLinks}
          currPage={currPage}
          logoutFunc={handleLogout}
        />
        <Nav
          className={styles.AppNavbar}
          currContent={currPage}
          logoutFunc={handleLogout}
        />
        <MainBody
          className={styles.AppContent}
          currContent={currPage}
          setPage={handleSetPage}
        />
      </div>
    </BreadcrumbProvider>
  );
};
