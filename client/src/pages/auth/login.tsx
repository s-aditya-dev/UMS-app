import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePattern, validateLength, PatternUsername, PatternPassword } from "@/utils/RegEx";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ArrowRight } from "lucide-react";

export const description =
  "A simple login form with email and password. The submit button says 'Sign in'.";

export function LoginForm() {
  // Hooks::-
  const { toast } = useToast();
  const navigate = useNavigate();

  // useStates:-
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [remember, setRemember] = useState<boolean>(false);

  // Event Handlers:-
  const handleUsernameChange = (inputUsername: string) => {
    if (validateLength(inputUsername, 20)) {
      toast({
        title: "Username Too Long",
        description: "Please keep your username under 20 characters.",
      });
    } else if (validatePattern(inputUsername, PatternUsername)) {
      toast({
        title: "Invalid Username Characters",
        description: "Usernames can only contain letters, numbers, underscores, @, and periods.",
      });
    } else {
      setUsername(inputUsername);
      return true;
    }
    return false;
  };

  const handlePasswordChange = (inputPassword: string) => {
    if (validateLength(inputPassword, 12)) {
      toast({
        title: "Password Too Long",
        description: "Please keep your password under 12 characters.",
      });
    } else if (validatePattern(inputPassword, PatternPassword)) {
      toast({
        title: "Invalid Password Characters",
        description: "Password can only contain letters and numbers.",
      });
    } else {
      setPassword(inputPassword);
      return true;
    }

    return false;
  };

  const handleSubmit = () => {
    // RegExp Patterns
    const patterns = {
      username: /^[a-zA-Z0-9_.]*$/,
      password: /^[a-zA-Z0-9]*$/,
    };

    // Function to generate toast messages
    const createToast = (
      title: string,
      description: string,
      variant: "default" | "destructive" = "default",
      actionTitle: string = "",
      actionOnClick?: () => void
    ) => {
      toast({
        variant,
        title,
        description,
        ...(actionTitle && {
          action: (
            <ToastAction altText={actionTitle} onClick={actionOnClick}>
              {actionTitle}
            </ToastAction>
          ),
        }),
      });
    };

    // Username and Password validations
    if (!Username) {
      createToast("Invalid Username", "Username cannot be empty.");
      return;
    }

    if (validatePattern(Username, patterns.username)) {
      createToast(
        "Invalid Username Characters",
        "Usernames can only contain letters, numbers, underscores, and periods."
      );
      return;
    }

    if (!Password) {
      createToast("Invalid Password", "Password cannot be empty.");
      return;
    }

    if (validatePattern(Password, patterns.password)) {
      createToast("Invalid Password Characters", "Password can only contain letters and numbers.");
      return;
    }

    try {
      console.log("Success");
      navigate("/panel");
    } catch {
      console.log("Error");
    }
  };

  return (
    <>
      <div className="w-svw h-svh grid place-items-center bg-primary-foreground">
        <Card className="w-full max-w-xs">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription className="text-base">
              Enter your username below to login.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-base">
                Email
              </Label>
              <Input
                id="username"
                type="username"
                placeholder="tony.stark@3000"
                required
                value={Username}
                className="text-base"
                onChange={(e) => handleUsernameChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <PasswordInput
                id="password"
                required
                value={Password}
                className="text-base"
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
            </div>

            <div className=" my-1 w-full flex justify-center items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={remember}
                onCheckedChange={() => setRemember((prev) => !prev)}
              />
              <Label htmlFor="rememberMe" className="italic text-base">
                Remember Me
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full font-semibold text-base"
              variant="expandIcon"
              size="icon"
              Icon={<ArrowRight className="translate-x-[-5px]" size={16} />}
              iconPlacement="right"
              onClick={() => {
                handleSubmit();
              }}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
