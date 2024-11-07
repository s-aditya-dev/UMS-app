import { userType } from "@/apps/users";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface UserTableProps {
  userList: userType[];
}

export const UserTable = ({ userList }: UserTableProps) => {
  const [showPass, setShowPass] = useState<string>("");

  const handleShowPassword = (uid: string) => {
    setShowPass((prev) => (prev === uid ? "" : uid));
  };

  return (
    <Card className="w-[90svw] md:w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Employee Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            userList.map((user, index) => (
              <TableRow key={user.uid} className="hover:bg-card">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.firstName + " " + user.lastName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {showPass === user.uid ? user.password : "••••••••"}
                </TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Locked</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="miniIcon"
                        onClick={() => handleShowPassword(user.uid)}
                      >
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleShowPassword(user.uid)}
                      >
                        {showPass === user.uid
                          ? "Hide password"
                          : "Show password"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete User</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Open Details</DropdownMenuItem>
                      <DropdownMenuItem>Quick preview</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
