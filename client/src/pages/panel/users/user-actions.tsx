import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userType } from "@/utils/types/user";
import { useNavigate } from "react-router-dom";
import useUserStore, { useUpdateUser } from "@/store/zustand/users";

interface UserActionProps {
  user: userType;
  showPass: string;
  handleShowPass: (id: string) => void;
}

export const UserAction = ({
  user,
  showPass,
  handleShowPass,
}: UserActionProps) => {
  // Hooks
  const navigate = useNavigate();
  const updateUser = useUpdateUser();
  const { setSelectedUserId } = useUserStore();
  // Event Handlers
  const handleOpenDetails = (id: string) => {
    navigate(`details/${id}`);
    setSelectedUserId(id);
  };

  const handleLockUser = async (id: string) => {
    const updates: Partial<userType> = user.isLocked
      ? { isLocked: false }
      : { isLocked: true };
    const reponse = await updateUser.mutate({ userId: id, updates });
    console.log(reponse);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="miniIcon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleShowPass(user._id)}>
          {showPass === user._id ? "Hide password" : "Show password"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleOpenDetails(user._id)}>
          Open Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLockUser(user._id)}>
          {!user.isLocked ? "Lock user" : "Unlock User"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
