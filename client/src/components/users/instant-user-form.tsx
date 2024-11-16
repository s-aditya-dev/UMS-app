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
import { toProperCase } from "@/utils/strUtils";
import { formatZodErrors } from "@/utils/zodUtils";
import { useState } from "react";
import { InstantUserSchema } from "@/utils/userSchema";
import { MultiSelect } from "../custom ui/multi-select";
import {
  createUser,
  generatePassword,
  generateUniqueId,
  generateUsername,
} from "./user-func";
import { userType } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Users", value: "user" },
  { label: "Manager", value: "manager" },
];

interface InstantUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InstantUserForm = ({
  open,
  onOpenChange,
}: InstantUserFormProps) => {
  // Hooks
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // use States
  const [newUser, setNewUser] = useState<userType>({
    _id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    roles: [],
    isLocked: false,
  });

  // Event Handlers
  const handleInputChange = (
    field: keyof userType,
    value: string | string[],
  ) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCreateUser = () => {
    const _id = generateUniqueId();
    const username = generateUsername(newUser.firstName.toLowerCase() || "");
    const password = generatePassword();
    const firstName = newUser.firstName ? toProperCase(newUser.firstName) : "";
    const lastName = newUser.lastName ? toProperCase(newUser.lastName) : "";

    const user = {
      ...newUser,
      _id,
      username,
      password,
      firstName,
      lastName,
    };

    const validation = InstantUserSchema.safeParse(user);

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
    createUser(user, dispatch);
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
            <FormFieldWrapper
              LabelText="FirstName"
              LabelFor="firstNameField"
              Important
              className="gap-2"
            >
              <Input
                id="firstNameField"
                placeholder="Enter first name"
                value={newUser.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              LabelText="LastName"
              LabelFor="lastNameField"
              Important
              className="gap-2"
            >
              <Input
                id="lastNameField"
                placeholder="Enter last name"
                value={newUser.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </FormFieldWrapper>
            <FormFieldWrapper
              LabelText="Roles"
              LabelFor="roleField"
              Important
              className="gap-2"
            >
              <MultiSelect
                id="roleField"
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
