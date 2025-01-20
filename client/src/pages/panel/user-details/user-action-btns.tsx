// UserActionButtons.tsx
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/custom ui/tooltip-provider";
import { KeyRound, Save, SquarePen, Trash2 } from "lucide-react";

interface UserActionButtonsProps {
  isEditable: boolean;
  onDelete: () => void;
  onUpdate: () => void;
  onResetPassword: () => void;
}

export const UserActionButtons = ({
  isEditable,
  onDelete,
  onUpdate,
  onResetPassword,
}: UserActionButtonsProps) => (
  <>
    <Tooltip content="Delete user">
      <Button
        variant="destructive"
        size="icon"
        className="mx-1 text-primary"
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </Tooltip>
    <Tooltip content={`${isEditable ? "Save" : "Edit"} user`}>
      <Button
        size="icon"
        className={`text-primary mx-1 ${
          isEditable
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={onUpdate}
      >
        {isEditable ? <Save /> : <SquarePen />}
      </Button>
    </Tooltip>
    <Tooltip content="Reset user password">
      <Button
        size="icon"
        className="mx-1 text-primary bg-yellow-500 hover:bg-yellow-600"
        onClick={onResetPassword}
      >
        <KeyRound />
      </Button>
    </Tooltip>
  </>
);
