import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { userType } from "@/apps/users";

const roles = ["admin", "user", "manager"];

interface InstantUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InstantUserForm = ({
  open,
  onOpenChange,
}: InstantUserFormProps) => {
  const [newUser, setNewUser] = useState<Partial<userType>>({
    firstName: "",
    lastName: "",
    roles: [],
    isLocked: false,
  });

  const handleInputChange = (
    field: keyof userType,
    value: string | boolean | Date | string[],
  ) => {
    setNewUser({ ...newUser, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[20rem]">
        <DialogHeader>
          <DialogTitle>User Form</DialogTitle>
          <DialogDescription>Create instant user</DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-col justify-center items-center gap-4">
            <FormFieldWrapper LabelText="FirstName" Important className="gap-2">
              <Input
                placeholder="Enter first name"
                value={newUser.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper LabelText="LastName" Important className="gap-2">
              <Input
                placeholder="Enter last name"
                value={newUser.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper LabelText="Role" Important className="gap-2">
              <Select
                onValueChange={(value) => handleInputChange("roles", [value])}
                value={newUser.roles?.[0] || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>User Roles</SelectLabel>
                    {roles.map((role, index) => (
                      <SelectItem key={index} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormFieldWrapper>
            <FormFieldWrapper LabelText="Email" className="gap-2">
              <Input
                type="email"
                placeholder="Enter email"
                value={newUser.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper LabelText="Phone" className="gap-2">
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={newUser.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </FormFieldWrapper>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Create</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
