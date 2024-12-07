import { DatePickerV2 } from "@/components/custom ui/date-time-pickers";
import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Input, PasswordInput } from "@/components/ui/input";

export const RegisterForm = () => {
  const handleDateClick = () => {};
  return (
    <div className="w-svw min-h-svh h-auto grid place-items-center bg-primary-foreground">
      <Card className="my-10 w-[80%] md:w-full max-w-md">
        <CardHeader>
          <CardTitle>Register User</CardTitle>
          <CardDescription>Fill the form up</CardDescription>
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
                // value={newUser.firstName || ""}
                // onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              <Input
                placeholder="Enter last name"
                // value={newUser.lastName || ""}
                // onChange={(e) => handleInputChange("lastName", e.target.value)}
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
              // value={newUser.email || ""}
              // onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <Input
                inputMode="numeric"
                placeholder="Enter phone number"
                // value={newUser.phone || ""}
                // onChange={(e) => handleInputChange("phone", e.target.value)}
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
                disabled
                // value={newUser.username || ""}
              />
              <PasswordInput
                wrapperClassName="w-full"
                placeholder="Enter password"
                autoComplete="new-password"
                // value={isDefaultPass ? "" : newUser.password || ""}
                // onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
          </FormFieldWrapper>
        </CardContent>
      </Card>
    </div>
  );
};
