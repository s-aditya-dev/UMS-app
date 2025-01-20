import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAction } from "@/pages/panel/users/user-actions";
import { userType } from "@/utils/types/user";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";

interface UserTableProps {
  userList: userType[];
  firstIndex: number;
}

export const UserTable = ({ userList, firstIndex }: UserTableProps) => {
  const [showPass, setShowPass] = useState<string>("");

  const handleShowPassword = (uid: string) => {
    setShowPass((prev) => (prev === uid ? "" : uid));
  };

  return (
    <Card className="w-[90svw] md:w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-card">
            <TableHead>#</TableHead>
            <TableHead className="whitespace-nowrap">Employee Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow className="hover:bg-card">
              <TableCell colSpan={8} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            userList.map((user, index) => (
              <TableRow key={user._id} className="hover:bg-card">
                <TableCell>{firstIndex + index + 1}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {user.firstName + " " + user.lastName}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {showPass === user._id ? user.password : "••••••••"}
                </TableCell>
                <TableCell>{user.isLocked ? "Locked" : "Unlocked"}</TableCell>
                <TableCell className="cursor-default">
                  <HoverCard>
                    <HoverCardTrigger>{user.roles[0]}</HoverCardTrigger>
                    <HoverCardContent className="w-auto">
                      <div className="text-sm font-semibold">
                        Roles assigned : {user.roles.join(", ")}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <UserAction
                    user={user}
                    showPass={showPass}
                    handleShowPass={handleShowPassword}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
