import { useEffect, useState } from "react";
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
import { CustomAxiosError } from "@/utils/AxiosTypes";

interface LoginUser {
  loginId: string;
  password: string;
}

export function LoginForm() {
  // Hooks::-
  const { toast } = useToast();
  const navigate = useNavigate();

  // useStates:-
  const [user, setUser] = useState<LoginUser>({
    loginId: "",
    password: "",
  });
  const [remember, setRemember] = useState<boolean>(false);

  // useEffect
  useEffect(() => {
    const storedLoginId = localStorage.getItem("rememberedLoginId");

    if (storedLoginId) {
      setUser({
        loginId: storedLoginId,
        password: "",
      });
      setRemember(true);
    }
  }, []);

  // Event Handlers:-
  const handleInputChange = (
    field: keyof LoginUser,
    value: string | string[],
  ) => {
    setUser({ ...user, [field]: value });
  };

  const handleRememberMe = (loginId: string) => {
    if (remember) {
      localStorage.setItem("rememberedLoginId", loginId);
    } else {
      localStorage.removeItem("rememberedLoginId");
    }
  };

  const handleLogin = async (user: LoginUser) => {
    console.log(user);
    try {
      const res = await newRequest.post("/auth/login", user);

      if (res.data.data.settings.isRegistered) {
        navigate(`/auth/register-user/${res.data.data._id}`);
      } else if (res.data.data.settings.isPassChange) {
        navigate(`/auth/change-password/${res.data.data._id}`);
      } else navigate("/panel/dashboard");

      handleRememberMe(user.loginId);
      console.log("Success:", res.data.data.firstName);
    } catch (error) {
      const axiosError = error as CustomAxiosError;
      console.log(axiosError);
      if (axiosError.response) {
        if (axiosError.response.data.error) {
          toast({
            title: "Login Error",
            description: axiosError.response.data.error,
            variant: "destructive",
          });
          return;
        }
        console.log("Status code:", axiosError.response.status);
        console.log("Data:", axiosError.response.data);
      } else {
        if (axiosError.code === "ERR_NETWORK")
          toast({
            title: "Server Issue",
            description: `• ${axiosError.message}`,
            variant: "destructive",
          });

        console.log(axiosError.message);
      }
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
                Email or Username
              </Label>
              <Input
                id="username"
                type="username"
                placeholder="tony.stark@3000"
                required
                value={user.loginId}
                className="text-base"
                onChange={(e) => handleInputChange("loginId", e.target.value)}
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
                autoComplete="off"
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
