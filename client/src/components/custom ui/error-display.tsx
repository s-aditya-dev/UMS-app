import { ArrowRight, CircleAlert } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/store/auth";

interface ErrorDisplayProp {
  errTitle?: string;
  errMsg: string;
  isLoginRequired?: boolean;
  children?: ReactNode | null;
}
export const ErrorDisplay = ({
  errTitle,
  errMsg,
  isLoginRequired = false,
  children = null,
}: ErrorDisplayProp) => {
  const { logout: handleLogout } = useAuth();
  // const handleLogout = useHandleLogout();
  return (
    <>
      <div className="bg-destructive p-3 mb-2 rounded-full">
        <CircleAlert size={96} />
      </div>
      <div className="font-semibold">
        {errTitle ? errTitle : "Error occurred:"}
      </div>
      {errMsg}
      {isLoginRequired && (
        <Button
          className="font-semibold my-3"
          variant="expandIcon"
          Icon={<ArrowRight className="translate-x-[-5px]" size={16} />}
          iconPlacement="right"
          onClick={handleLogout}
        >
          Go to login
        </Button>
      )}
      {children && children}
    </>
  );
};
