import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const UserDetails = () => {
  // Hooks
  const { setBreadcrumbs } = useBreadcrumb();
  const { pageno } = useParams();

  // useEffects
  useEffect(() => {
    setBreadcrumbs([
      { to: `/panel/users/${pageno}`, label: "Users" },
      { label: "Details" },
    ]);
  }, []);

  return <div>UserDetails</div>;
};
