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
import { userType } from "@/apps/users";

interface UserActionProps {
  user: userType;
  showPass: string;
  handleShowPass: (id: string) => void;
}

export const UserAction = ({
  user,
  showPass,
  handleShowPass,
}: UserActionProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary" size="miniIcon">
        <Ellipsis />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => handleShowPass(user.uid)}>
        {showPass === user.uid ? "Hide password" : "Show password"}
      </DropdownMenuItem>
      <DropdownMenuItem>Delete User</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Open Details</DropdownMenuItem>
      <DropdownMenuItem>Quick preview</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
