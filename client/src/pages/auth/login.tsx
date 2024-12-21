import { useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "@/utils/newRequest";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";
import { formatZodErrors } from "@/utils/zodUtils";
import { ArrowRight } from "lucide-react";
import { LoginUserSchema } from "@/../../shared/zod-schema/user";

interface LoginUser {
  username: string;
  password: string;
}

export function LoginForm() {
  // Hooks::-
  const { toast } = useToast();
  const navigate = useNavigate();

  // useStates:-
  const [user, setUser] = useState<LoginUser>({
    username: "",
    password: "",
  });
  const [remember, setRemember] = useState<boolean>(false);

  // Event Handlers:-
  const handleInputChange = (
    field: keyof LoginUser,
    value: string | string[],
  ) => {
    setUser({ ...user, [field]: value });
  };

  const handleLogin = async (user: LoginUser) => {
    try {
      const res = await newRequest.post("/auth/login", user);
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      console.log("Success:", user);
      navigate("/panel");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    const validation = LoginUserSchema.safeParse(user);

    if (!validation.success) {
      const errorMessages = formatZodErrors(validation.error.errors);

      toast({
        title: "Login Error",
        description: `Please correct the following errors:\n${errorMessages}`,
      });
      return;
    }

    handleLogin(user);
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
                value={user.username}
                className="text-base"
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <PasswordInput
                id="password"
                required
                value={user.password}
                className="text-base"
                onChange={(e) => handleInputChange("password", e.target.value)}
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
