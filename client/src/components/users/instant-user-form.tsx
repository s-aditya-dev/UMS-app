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
} from "../ui/select";
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
  const [newUser, setNewUser] = useState<userType>();

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
              <Input placeholder="Enter first name" />
            </FormFieldWrapper>
            <FormFieldWrapper LabelText="LastName" Important className="gap-2">
              <Input placeholder="Enter last name" />
            </FormFieldWrapper>
            <FormFieldWrapper LabelText="Role" Important className="gap-2">
              <Select>
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
