import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { userType } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";

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

  // Event Handlers
  const handleOpenDetails = (id: string) => {
    navigate(`details/${id}`);
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
        <DropdownMenuItem>Quick preview</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
