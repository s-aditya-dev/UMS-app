import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../scss/layout/AppLayout.module.scss";

// Panel Components
import { MainBody } from "./modules/main";
import { Nav } from "./modules/nav";
import { Sidebar } from "./modules/sidebar";

import { NavLinks } from "./data";

export const Panel = () => {
  // useStates
  const [currPage, setPage] = useState("Dashboard");

  //Hooks
  const navigate = useNavigate();

  //Event Handlers
  const handleLogout = () => {
    //Logout Logic
    navigate("/auth/login");
  };

  const handleSetPage = useCallback((newPage: string) => {
    setPage(newPage);
  }, []);

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
