import { userType } from "@/apps/users";
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { MultiSelect } from "../custom ui/multi-select";
import { formatZodErrors } from "@/utils/zodUtils";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Users", value: "user" },
  { label: "Manager", value: "manager" },
];

const instantUserScheme = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  roles: z.array(z.string()).min(1),
  isLocked: z.boolean(),
});

interface InstantUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InstantUserForm = ({
  open,
  onOpenChange,
}: InstantUserFormProps) => {
  // Hooks
  const { toast } = useToast();

  // use States
  const [newUser, setNewUser] = useState<Partial<userType>>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    roles: [],
    isLocked: false,
  });

  // util functions
  const generateUsername = (firstName: string) => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
    return `${firstName}${randomDigits}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // Generates random 8-char password
  };

  // Event Handlers
  const handleInputChange = (
    field: keyof userType,
    value: string | string[],
  ) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCreateUser = () => {
    const username = generateUsername(newUser.firstName || "");
    const password = generatePassword();

    const user = {
      ...newUser,
      username,
      password,
    };

    const validation = instantUserScheme.safeParse(user);

    if (!validation.success) {
      const errorMessages = formatZodErrors(validation.error.errors);

      toast({
        title: "Form Validation Error",
        description: `Please correct the following errors:\n${errorMessages}`,
        variant: "warning",
      });
      return;
    }

    //Actual user creation logic goes here
    console.log("User created:", instantUserScheme.safeParse(user));

    onOpenChange(false);
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
            <FormFieldWrapper LabelText="Roles" Important className="gap-2">
              <MultiSelect
                options={roles}
                defaultValue={newUser?.roles || []}
                onValueChange={(value) => handleInputChange("roles", value)}
                placeholder="Select participants"
                variant="inverted"
                maxCount={3}
              />
            </FormFieldWrapper>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateUser}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
