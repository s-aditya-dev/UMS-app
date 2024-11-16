import { Card } from "@/components/ui/card";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { RootState } from "@/store";
import { selectUserById } from "@/store/slices/userSlice";
import { AtSign, Mail, PhoneCall, Pyramid, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const UserDetails = () => {
  // Hooks
  const { setBreadcrumbs } = useBreadcrumb();
  const { pageno, id: userID } = useParams();
  const user = userID
    ? useSelector((state: RootState) => selectUserById(state, userID))
    : null;

  useEffect(() => {
    setBreadcrumbs([
      { to: `/panel/users/${pageno}`, label: "Users" },
      { label: "Details" },
    ]);
  }, []);

  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <Card className="p-4">
      <h2 className="flex items-center gap-2">
        <UserRound size={20} />
        {user.firstName} {user.lastName}
      </h2>
      <p className="flex items-center gap-2">
        <Mail size={18} /> {user.email || "N/A"}
      </p>
      <p className="flex items-center gap-2">
        <AtSign size={18} /> {user.username}
      </p>
      <p className="flex items-center gap-2">
        <PhoneCall size={18} /> {user.phone || "N/A"}
      </p>
      <p className="flex items-center gap-2">
        <Pyramid size={18} /> {user.roles.join(", ")}
      </p>
      <p className="flex items-center gap-2">
        <Pyramid size={18} /> {user.dob?.toString() || "N/A"}
        {`Type of Date: ${typeof user.dob}`}
      </p>
    </Card>
  );
};
