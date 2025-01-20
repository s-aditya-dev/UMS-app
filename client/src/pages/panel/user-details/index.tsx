// UserDetails.tsx
import { useAlertDialog } from "@/components/custom ui/alertDialog";
import { CenterWrapper } from "@/components/custom ui/center-page";
import { Loader } from "@/components/custom ui/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { useToast } from "@/hooks/use-toast";
import useUserStore, {
  useDeleteUser,
  useUpdateUser,
  useUser,
} from "@/store/users";
import { formatZodErrors } from "@/utils/func/zodUtils";
import { userType } from "@/utils/types/user";
import { FullUserSchema } from "@/utils/zod-schema/user";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NameForm, PersonalInfoForm, RolesForm } from "./user-form";
import { UserActionButtons } from "./user-action-btns";

const INITIAL_USER_STATE: Partial<userType> = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  roles: [],
  dob: new Date(),
  settings: {
    isRegistered: true,
    isPassChange: false,
  },
};

export function UserDetails() {
  const navigate = useNavigate();
  const { selectedUserId } = useUserStore();
  const { setBreadcrumbs } = useBreadcrumb();
  const { id } = useParams();
  const { toast } = useToast();
  const userId = selectedUserId || id;
  const { data: user, isLoading, error } = useUser(userId!);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const updateDialog = useAlertDialog({
    iconName: "Save",
    alertType: "Success",
    title: "Update User",
    description: `Are you sure you want to update this user?`,
    actionLabel: "Update",
    cancelLabel: "Cancel",
  });

  const deleteDialog = useAlertDialog({
    iconName: "Trash2",
    alertType: "Danger",
    title: "Delete User",
    description: `Are you sure you want to delete this user?`,
    actionLabel: "Delete",
    cancelLabel: "Cancel",
  });

  const [isEditable, setEditable] = useState(false);
  const [userData, setUserData] = useState(INITIAL_USER_STATE);
  const [originalData, setOriginalData] = useState(INITIAL_USER_STATE);

  useEffect(() => {
    if (user) {
      console.log(user);
      const formattedUser = {
        ...INITIAL_USER_STATE,
        ...user,
        dob: user.dob ? new Date(user.dob) : new Date(),
      };
      setUserData(formattedUser);
      setOriginalData(formattedUser);
    }
  }, [user]);

  useEffect(() => {
    setBreadcrumbs([
      { to: `/panel/users/`, label: "Users" },
      { label: "Details" },
    ]);
  }, [setBreadcrumbs]);

  const hasChanges = useCallback(() => {
    return !isEqual(userData, originalData);
  }, [userData, originalData]);

  const handleUpdate = async () => {
    if (isEditable) {
      if (!hasChanges()) {
        setEditable(false);
        return;
      }

      const validation = FullUserSchema.safeParse(userData);

      if (!validation.success) {
        const errorMessages = formatZodErrors(validation.error.errors);
        toast({
          title: "Form Validation Error",
          description: `Please correct the following errors:\n${errorMessages}`,
          variant: "warning",
        });
        return;
      }

      if (userId) {
        updateDialog.show({
          config: {
            description: `Are you sure you want to update ${user?.username}?`,
          },
          onAction: async () => {
            await updateUser.mutate({ userId, updates: userData });
            setOriginalData(userData);
            setEditable(false);
          },
          onCancel: () => {
            setUserData(originalData);
            setEditable(false);
          },
        });
      }
    } else {
      setEditable(true);
    }
  };

  const handleDelete = () => {
    if (userId) {
      deleteDialog.show({
        config: {
          description: `Are you sure you want to delete ${user?.username}?`,
        },
        onAction: async () => {
          await deleteUser.mutate(userId);
          navigate("/panel/users");
        },
      });
    }
  };

  const handleResetPassword = () => {
    // Implement password reset logic
    console.log("Reset password clicked");
  };

  const handleInputChange = (
    field: keyof typeof userData,
    value: string | string[] | Date,
  ) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  if (!userId) return <div>User not found</div>;
  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error?.message}</div>;

  return (
    <CenterWrapper>
      <Card className="my-10 w-[90%] md:w-full max-w-md">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            Information about user: {user.username}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex gap-4 flex-col">
          <NameForm
            userData={userData}
            isEditable={isEditable}
            onInputChange={handleInputChange}
          />
          <PersonalInfoForm
            userData={userData}
            isEditable={isEditable}
            onInputChange={handleInputChange}
          />
          <RolesForm
            userData={userData}
            isEditable={isEditable}
            onInputChange={handleInputChange}
          />
        </CardContent>

        <CardFooter>
          <UserActionButtons
            isEditable={isEditable}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onResetPassword={handleResetPassword}
          />
        </CardFooter>
      </Card>
      <updateDialog.AlertDialog />
      <deleteDialog.AlertDialog />
    </CenterWrapper>
  );
}
