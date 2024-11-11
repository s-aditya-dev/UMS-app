import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as Icons from "lucide-react";
import { ReactNode } from "react";

type AlertType = "Danger" | "Warn" | "Success" | "Info";

interface DialogWithIconProps {
  iconName: keyof typeof Icons;
  alertType?: AlertType;
  title: string;
  description: string;
  cancelLabel?: string;
  actionLabel?: string;
  onCancel?: () => void;
  onAction?: () => void;
  children: ReactNode;
}

export function DialogWithIcon({
  iconName,
  alertType = "Danger",
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
