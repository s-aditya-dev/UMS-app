import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserForm = ({ open, onOpenChange }: UserFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User registration form</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
