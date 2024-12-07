import { useToast } from "@/hooks/use-toast";
import { AppDispatch } from "@/store";
import { userType } from "@/store/slices/userSlice";
import { toProperCase } from "@/utils/func/strUtils";
import { generateUniqueId } from "@/utils/func/uniqueId";
import { FullUserSchema } from "@/utils/zod schemas/userSchema";
import { formatZodErrors } from "@/utils/zodUtils";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { DatePickerV2 } from "../custom ui/date-time-pickers";
import { FormFieldWrapper } from "../custom ui/form-field-wrapper";
import { MultiSelect } from "../custom ui/multi-select";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input, PasswordInput } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { createUser, generatePassword } from "./user-func";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: userType | null;
}

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Users", value: "user" },
  { label: "Manager", value: "manager" },
];

export const UserForm = ({
  open,
  onOpenChange,
  initialValue = null,
}: UserFormProps) => {
  // Hooks
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // use States
  const [newUser, setNewUser] = useState<userType>(
    initialValue ?? {
      _id: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      dob: undefined,
      roles: [],
      isLocked: false,
    },
  );

  const [isDefaultPass, setDefaultPass] = useState(false);

  const handleInputChange = (
    field: keyof userType,
    value: string | string[],
  ) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCreateUser = () => {
    const _id = generateUniqueId();
    const username = newUser.username.toLowerCase();
    const password = isDefaultPass ? generatePassword() : newUser.password;
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

    const validation = FullUserSchema.safeParse(user);

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

  const handleDateClick = (date: Date) => {
    setNewUser({ ...newUser, dob: date });
    console.log(date);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] px-2">
        <DialogHeader>
          <DialogTitle>User registration form</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex flex-col gap-2 h-[450px] xl:h-auto xl:max-h-[80svh] px-4">
          <div className="flex gap-4 flex-col mb-6">
            <FormFieldWrapper
              LabelText="Name"
              LabelFor="firstNameField"
              Important
              className="gap-3"
            >
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <Input
                  id="firstNameField"
                  placeholder="Enter first name"
                  value={newUser.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                <Input
                  placeholder="Enter last name"
                  value={newUser.lastName || ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper
              LabelText="Personal Info"
              LabelFor="emailField"
              Important
              className="gap-3"
            >
              <Input
                id="emailField"
                placeholder="Enter @ email"
                type="email"
                value={newUser.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <Input
                  inputMode="numeric"
                  placeholder="Enter phone number"
                  value={newUser.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                <DatePickerV2
                  onDateChange={handleDateClick}
                  disableDates={"future"}
                  placeholder={"Select your DOB"}
                  closeOnDayClick
                />
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper
              LabelText="Username & Password"
              LabelFor="usernameField"
              Important
              className="gap-3"
            >
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <Input
                  id="usernameField"
                  placeholder="Enter username"
                  type="text"
                  value={newUser.username || ""}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
                <PasswordInput
                  wrapperClassName="w-full"
                  placeholder={
                    isDefaultPass ? "Generated Password..." : "Enter password"
                  }
                  autoComplete="new-password"
                  disabled={isDefaultPass}
                  value={isDefaultPass ? "" : newUser.password || ""}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center gap-3 px-1">
                <Checkbox
                  id="defaultPass"
                  checked={isDefaultPass}
                  onClick={() => setDefaultPass(!isDefaultPass)}
                />
                <Label
                  htmlFor="defaultPass"
                  className="font-semibold leading-5"
                >
                  Generate random password, require change on first login
                </Label>
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper
              LabelText="Roles"
              LabelFor="roleField"
              Important
              className="gap-3"
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateUser}>Create</Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
