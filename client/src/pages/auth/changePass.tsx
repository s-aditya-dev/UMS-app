import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatZodErrors } from "@/utils/zodUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { passwordSchema } from "@/../../shared/zod-schema/password";

interface ChangePassword {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export function ChangePass() {
  // Hooks::-
  const { toast } = useToast();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState<ChangePassword>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleInputChange = (
    field: keyof ChangePassword,
    value: string | string[],
  ) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const handleSubmission = (passwords: ChangePassword) => {
    try {
      console.log(passwords);
      navigate("/login");
    } catch {
      console.log("Error");
    }
  };

  const handleSave = () => {
    const validation = passwordSchema.safeParse(passwords);

    if (!validation.success) {
      const errorMessages = formatZodErrors(validation.error.errors);

      toast({
        title: "Password Submission Error",
        description: `Please correct the following errors:\n${errorMessages}`,
        variant: "warning",
      });
      return;
    }

    //Actual user creation logic goes here
    handleSubmission(passwords);
  };

  return (
    <div className="w-svw h-svh grid place-items-center bg-primary-foreground">
      <Card className="max-w-xs w-full">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>After saving, you'll be logged out.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="current">Current password</Label>
            <PasswordInput
              id="current"
              value={passwords.current_password}
              autoComplete="new-password"
              onChange={(e) =>
                handleInputChange("current_password", e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">New password</Label>
            <PasswordInput
              id="new"
              value={passwords.new_password}
              autoComplete="new-password"
              onChange={(e) =>
                handleInputChange("new_password", e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm">Confirm password</Label>
            <PasswordInput
              id="confirm"
              value={passwords.confirm_password}
              autoComplete="new-password"
              onChange={(e) =>
                handleInputChange("confirm_password", e.target.value)
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save password</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
