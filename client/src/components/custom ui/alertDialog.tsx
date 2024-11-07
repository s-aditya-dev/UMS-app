import React from "react";
import PropTypes from "prop-types";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import * as Icons from "lucide-react";

type AlertType = "Danger" | "Warn" | "Success" | "Info";

interface DialogWithIconProps {
  iconName: keyof typeof Icons;
  alertType: AlertType;
  title: string;
  description: string;
  cancelLabel?: string;
  actionLabel?: string;
  onCancel?: () => void;
  onAction?: () => void;
  children: React.ReactNode;
}

export function DialogWithIcon({
  iconName,
  alertType,
  title,
  description,
  cancelLabel,
  actionLabel,
  onCancel,
  onAction,
  children,
}: DialogWithIconProps) {
  const IconComponent = Icons[iconName] as React.ComponentType;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogIcon alertType={alertType}>
          {IconComponent && <IconComponent />}
        </AlertDialogIcon>
        <AlertDialogHeader className="sm:col-span-1">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:col-span-2">
          {cancelLabel && (
            <AlertDialogCancel onClick={onCancel}>
              {cancelLabel}
            </AlertDialogCancel>
          )}
          {actionLabel && onAction && (
            <AlertDialogAction onClick={onAction}>
              {actionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

DialogWithIcon.propTypes = {
  iconName: PropTypes.oneOf(Object.keys(Icons) as (keyof typeof Icons)[])
    .isRequired,
  alertType: PropTypes.oneOf(["Danger", "Warn", "Success", "Info"]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string,
  actionLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onAction: PropTypes.func,
  children: PropTypes.node.isRequired,
};

// Example Usage:-
{/* <DialogWithIcon
  iconName="AlertCircle" // Specify the icon name from lucide-react
  alertType="Danger" // Specify the alert type
  title="Delete Item"
  description="Are you sure you want to delete this item? This action cannot be undone."

  //buttons are not required if the label or the action of that button is not provided the button wont load
  cancelLabel="Cancel"
  onCancel={() => console.log("canceled")}
  actionLabel="Delete"
  onAction={() => console.log("action")}
>
  <button className="btn btn-danger">Delete</button>
</DialogWithIcon>; */}
