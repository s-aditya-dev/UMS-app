import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "../ui/input";
import { FormFieldWrapper } from "../custom ui/form-field-wrapper";

interface InstantUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InstantUserForm = ({
  open,
  onOpenChange,
}: InstantUserFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[20rem]">
        <DialogHeader>
          <DialogTitle>User Form</DialogTitle>
          <DialogDescription>Create instant user</DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-col justify-center items-center gap-4">
            <FormFieldWrapper LabelText="Username" Important className="gap-2">
              <Input />
            </FormFieldWrapper>
            <FormFieldWrapper LabelText="Password" Important className="gap-2">
              <PasswordInput />
            </FormFieldWrapper>
            <FormFieldWrapper
              LabelText="Confirm Password"
              Important
              className="gap-2"
            >
              <PasswordInput />
            </FormFieldWrapper>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose>
            <Button>Create</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
