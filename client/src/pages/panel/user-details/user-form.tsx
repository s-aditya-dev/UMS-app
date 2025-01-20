// UserForms.tsx
import { Input } from "@/components/ui/input";
import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import { DatePickerV2 } from "@/components/custom ui/date-time-pickers";
import { MultiSelect } from "@/components/custom ui/multi-select";
import { userType } from "@/utils/types/user";
import { useRoles } from "@/store/role";
import { useMemo } from "react";

interface UserFormProps {
  userData: Partial<userType>;
  isEditable: boolean;
  onInputChange: (
    field: keyof userType,
    value: string | string[] | Date,
  ) => void;
}

export const NameForm = ({
  userData,
  isEditable,
  onInputChange,
}: UserFormProps) => (
  <FormFieldWrapper
    LabelText="Name"
    LabelFor="firstNameField"
    Important={isEditable}
    className="gap-3"
  >
    <div className="flex flex-wrap sm:flex-nowrap gap-2">
      <Input
        id="firstNameField"
        placeholder="Enter first name"
        disabled={!isEditable}
        value={userData.firstName}
        onChange={(e) => onInputChange("firstName", e.target.value)}
      />
      <Input
        placeholder="Enter last name"
        disabled={!isEditable}
        value={userData.lastName}
        onChange={(e) => onInputChange("lastName", e.target.value)}
      />
    </div>
  </FormFieldWrapper>
);

export const PersonalInfoForm = ({
  userData,
  isEditable,
  onInputChange,
}: UserFormProps) => (
  <FormFieldWrapper
    LabelText="Personal Info"
    LabelFor="emailField"
    Important={isEditable}
    className="gap-3"
  >
    <Input
      id="emailField"
      placeholder="Enter @ email"
      type="email"
      disabled={!isEditable}
      value={userData.email}
      onChange={(e) => onInputChange("email", e.target.value)}
    />
    <div className="flex flex-wrap sm:flex-nowrap gap-2">
      <Input
        inputMode="numeric"
        placeholder="Enter phone number"
        disabled={!isEditable}
        value={userData.phone}
        onChange={(e) => onInputChange("phone", e.target.value)}
      />
      <DatePickerV2
        defaultDate={userData.dob}
        disabled={!isEditable}
        onDateChange={(date) => onInputChange("dob", date)}
        disableDates="future"
        placeholder="Select your DOB"
        closeOnDayClick
      />
    </div>
  </FormFieldWrapper>
);

export const RolesForm = ({
  userData,
  isEditable,
  onInputChange,
}: UserFormProps) => {
  const { rolesArray } = useRoles();

  const roles = useMemo(() => {
    if (rolesArray.data) {
      return rolesArray.data.map((role) => ({
        label: role,
        value: role,
      }));
    }
    return [];
  }, [rolesArray]);

  return (
    <FormFieldWrapper
      LabelText="Roles"
      LabelFor="roleField"
      Important={isEditable}
      className="gap-3"
    >
      <MultiSelect
        id="roleField"
        options={roles}
        defaultValue={userData.roles}
        disabled={!isEditable}
        onValueChange={(value) => onInputChange("roles", value)}
        placeholder="Select participants"
        variant="inverted"
        maxCount={3}
      />
    </FormFieldWrapper>
  );
};
