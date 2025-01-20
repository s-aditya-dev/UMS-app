import { DatePickerV2 } from "@/components/custom ui/date-time-pickers";
import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import { Loader } from "@/components/custom ui/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser, useUpdateUser } from "@/store/users";
import { userType } from "@/utils/types/user";
import { CircleX } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const RegisterForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id!);
  const updateUser = useUpdateUser();

  const [newUser, setNewUser] = useState<Partial<userType>>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    dob: new Date(),
    settings: {
      isRegistered: true,
      isPassChange: false,
    },
  });

  useEffect(() => {
    if (user) {
      setNewUser((prevState) => ({
        ...prevState,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob ? new Date(user.dob) : new Date(),
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof typeof newUser, value: string) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateClick = (date: Date) => {
    setNewUser((prev) => ({
      ...prev,
      dob: date,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateUser.mutateAsync({
        userId: id!,
        updates: newUser,
      });
      toast({
        title: "Success",
        description: "Registration completed successfully",
        variant: "success",
      });
      navigate("/panel/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to complete registration",
        variant: "destructive",
      });
    }
  };

  if (isLoading || updateUser.isPending) {
    return (
      <div className="w-svw min-h-svh h-auto grid place-items-center bg-primary-foreground">
        <Loader />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-svw min-h-svh h-auto grid place-items-center bg-primary-foreground">
        <Card className="p-4">
          <CardTitle className="text-destructive mb-2 flex items-center gap-1">
            Error
            <CircleX size={20} />
          </CardTitle>
          <CardDescription>
            User not found or failed to load data.
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-svw min-h-svh h-auto grid place-items-center bg-primary-foreground">
      <Card className="my-10 w-[80%] md:w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Registration</CardTitle>
          <CardDescription>Update your information</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 flex-col">
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
                value={newUser.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              <Input
                placeholder="Enter last name"
                value={newUser.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
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
              value={newUser.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <Input
                inputMode="numeric"
                placeholder="Enter phone number"
                value={newUser.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
              <DatePickerV2
                defaultDate={newUser.dob}
                onDateChange={handleDateClick}
                disableDates="future"
                placeholder="Select your DOB"
                closeOnDayClick
              />
            </div>
          </FormFieldWrapper>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full sm:w-auto sm:ml-auto"
            onClick={handleSubmit}
            disabled={!newUser.firstName || !newUser.lastName || !newUser.email}
          >
            Complete Registration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
