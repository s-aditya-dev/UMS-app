import { Tooltip } from "@/components/custom ui/tooltip-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Flag, Plus, SquarePen, Trash2 } from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import { DialogWithIcon } from "../custom ui/alertDialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

interface CategoriesFilterProps extends React.HTMLAttributes<HTMLElement> {
  categorieList: string[];
  filterFunc?: (selectedCategories: string[]) => void;
  editCategoryAccess: boolean;
  deleteFunc?: (Category: string) => void;
  saveFunc?: (selectedCategories: string[]) => void;
}

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  categorieList,
  filterFunc,
  editCategoryAccess = false,
  deleteFunc,
  saveFunc,
  className,
  ...props
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCheckboxChange = (
    Type: string,
    isChecked: boolean | "indeterminate",
  ) => {
    if (isChecked === true) {
      setSelectedCategories((prevSelected) => [...prevSelected, Type]);
    } else {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((category) => category !== Type),
      );
    }
  };

  useEffect(() => {
    if (filterFunc) {
      filterFunc(selectedCategories);
    }
  }, [selectedCategories, filterFunc]);

  return (
    <Card className={cn("min-w-60 w-full h-full", className)} {...props}>
      <CardHeader className="flex flex-row justify-around items-center flex-wrap sm:justify-between gap-6 text-xl border-b-2">
        <CardTitle className="w-auto text-lg flex items-center gap-2">
          <Flag className="h-4 w-4" />
          Categories
        </CardTitle>

        {editCategoryAccess && (
          <CategorieModal
            categorieList={categorieList}
            saveFunc={saveFunc}
            deleteFunc={deleteFunc}
          >
            <span>
              <Tooltip content="Edit Category" side="bottom">
                <Button variant="outline" size="icon">
                  <SquarePen className="h-5 w-5" />
                </Button>
              </Tooltip>
            </span>
          </CategorieModal>
        )}
      </CardHeader>
      <ScrollArea className="h-[250px]">
        <CardContent>
          {categorieList.map((item: string, index) => (
            <React.Fragment key={index}>
              <div className="w-full flex justify-start items-center gap-3 my-3">
                <Checkbox
                  id={item}
                  onCheckedChange={(isChecked: boolean | "indeterminate") =>
                    handleCheckboxChange(item, isChecked)
                  }
                />
                <Label htmlFor={item}>{item}</Label>
              </div>
              {index < categorieList.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

//CaategorieModal
interface CategorieModalProps {
  children: ReactNode;
  categorieList: string[];
  deleteFunc?: (category: string) => void;
  saveFunc?: (selectedCategories: string[]) => void;
}

interface NewCategory {
  id: number;
}

const CreateNewCategory = ({
  onDelete,
  onChange,
}: {
  id: number;
  onDelete: () => void;
  onChange: (value: string) => void;
}) => {
  return (
    <TableRow>
      <TableCell className="p-0">
        <input
          className="w-full h-16 outline-none px-4 bg-transparent"
          placeholder="Enter your category"
          onChange={(e) => onChange(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400"
          onClick={onDelete}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const CategorieModal = ({
  children,
  categorieList,
  deleteFunc,
  saveFunc,
}: CategorieModalProps) => {
  const { toast } = useToast();

  // useStates
  const [newCategories, setNewCategories] = useState<NewCategory[]>([]);
  const [newCategoryValues, setNewCategoryValues] = useState<{
    [key: number]: string;
  }>({});

  // Variable declareation
  const NewCategoryLimit = 4;
  let counter = 0;

  // add New Category funtion
  const addNewCategoryRow = () => {
    if (newCategories.length < NewCategoryLimit) {
      setNewCategories((prev) => [...prev, { id: Date.now() + counter++ }]);
    } else {
      toast({
        title: "Maximum category limit reached",
        description: "You can only add up to 4 categories at a time",
      });
    }
  };

  //Function to delete specific new category rows
  const deleteNewCategoryRow = (id: number) => {
    setNewCategories((prev) => prev.filter((category) => category.id !== id));
    setNewCategoryValues((prev) => {
      const updatedValues = { ...prev };
      delete updatedValues[id];
      return updatedValues;
    });
  };

  // Function to delete all new category rows
  const deleteAllNewCategories = () => {
    setNewCategories([]);
    setNewCategoryValues({});
  };

  return (
    <Dialog onOpenChange={deleteAllNewCategories}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90svw] h-[65svh] sm:h-auto">
        <DialogHeader className="m-2">
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[448px] rounded-md border">
          <Table>
            <TableBody>
              {categorieList.map((item) => (
                <TableRow key={item}>
                  <TableCell className="w-full">{item}</TableCell>
                  <TableCell className="w-3">
                    <DialogWithIcon
                      iconName="Trash2"
                      alertType="Danger"
                      title="Delete category"
                      description="Are you sure you want to delete this category? This action cannot be undone."
                      cancelLabel="Cancel"
                      actionLabel="Delete"
                      onAction={() => deleteFunc?.(item)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </DialogWithIcon>
                  </TableCell>
                </TableRow>
              ))}

              {/* New Category Rows */}
              {newCategories.map((category) => (
                <CreateNewCategory
                  key={category.id}
                  id={category.id}
                  onDelete={() => deleteNewCategoryRow(category.id)}
                  onChange={(value) =>
                    setNewCategoryValues((prev) => ({
                      ...prev,
                      [category.id]: value,
                    }))
                  }
                />
              ))}

              <TableRow>
                <TableCell colSpan={2}>
                  <Button variant="ghost" onClick={addNewCategoryRow}>
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="font-semibold">Add category</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="text-base font-semibold">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="text-base font-semibold"
              onClick={() => {
                const nonEmptyNewCategories = Object.values(
                  newCategoryValues,
                ).filter((value) => value.trim() !== "");
                const allCategories = [
                  ...categorieList,
                  ...nonEmptyNewCategories,
                ];
                saveFunc?.(allCategories);
              }}
            >
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
