import {
  DatePickerWithRange,
  DateTimeRangePicker,
} from "@/components/custom ui/date-time-pickers";
import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import { MultiSelect } from "@/components/custom ui/multi-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateUniqueId } from "@/utils/func/uniqueId";
import { ReactNode, useState } from "react";
import { DateRange } from "react-day-picker";
import { SubmitHandler, useForm } from "react-hook-form";
import { EventType } from "@/store/slices/taskSlice";

const usersList = [
  { value: "Alice Johnson", label: "Alice Johnson" },
  { value: "Aditya", label: "Aditya" },
  { value: "Anand", label: "Anand" },
  { value: "Akhtar", label: "Akhtar" },
  { value: "Vicky", label: "Vicky" },
  { value: "Sujal", label: "Sujal" },
];

export type TaskFormMetadataType = {
  categoryList: string[];
  priorityList: string[];
  statusList: string[];
};

interface TaskFormProps {
  children: ReactNode;
  initialEvent?: EventType | null;
  initialData?: TaskFormMetadataType | null;
}

export const TaskForm = ({
  children,
  initialEvent = null,
  initialData = null,
}: TaskFormProps) => {
  //useForm hook
  const defaultEvent: EventType = {
    id: generateUniqueId(),
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    month_year: "",
    assignedBy: "",
    category: "",
    priority: "",
    status: "",
    participants: [],
  };

  const { register, handleSubmit, setValue, watch } = useForm<EventType>({
    defaultValues: {
      ...defaultEvent,
      ...initialEvent,
      id: initialEvent?.id || generateUniqueId(), // Ensure a unique ID is always generated.
    },
  });

  // Watch for changes in form fields
  const participants = watch("participants");
  const category = watch("category");
  const priority = watch("priority");
  const status = watch("status");
  const startDate = watch("start");
  const endDate = watch("end");

  //useStates
  const [isRangeEvent, setIsRangeEvent] = useState(false);

  //Variable Declarations
  const Title = !initialEvent ? "Create Event" : "Update Event";
  const categoryList = initialData
    ? initialData.categoryList
    : ["Exams", "Testing"];
  const priorityList = initialData
    ? initialData.priorityList
    : ["High", "Medium", "Low"];
  const statusList = initialData
    ? initialData.statusList
    : ["Incomplete", "Complete", "Canceled"];

  // useEffect
  // Event Handlers
  const handleSetRangeEvent = () => {
    if (isRangeEvent) {
      setValue("end", startDate);
    }
    setIsRangeEvent(!isRangeEvent);
  };

  const handleSetDate = (date: DateRange) => {
    if (date.from && date.to) {
      setValue("start", date.from);
      setValue("end", date.to);
      setValue("month_year", (startDate.getMonth() + 1).toString());
    }
  };

  const onSave: SubmitHandler<EventType> = (data) => {
    console.log("Form Submitted Data:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90vw] px-2">
        <DialogHeader className="px-4">
          <DialogTitle>{Title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[450px] xl:h-auto xl:max-h-[80svh] px-4">
          <form onSubmit={handleSubmit(onSave)}>
            <div
              id="form-container"
              className="w-full my-1 flex flex-col justify-center items-center gap-6 mb-6"
            >
              <FormFieldWrapper
                LabelText="Title"
                LabelFor="titleInput"
                Important
              >
                <Input
                  id="titleInput"
                  placeholder="Enter event title"
                  className="w-full"
                  {...register("title")}
                />
              </FormFieldWrapper>
              <FormFieldWrapper LabelText="Description" Important>
                <Textarea
                  placeholder="Enter event description"
                  className="w-full"
                  {...register("description")}
                />
              </FormFieldWrapper>
              <FormFieldWrapper LabelText="Date & Time" Important>
                <div
                  id="selectTiming"
                  className="flex items-center sm:justify-around gap-3 flex-wrap-reverse"
                >
                  <div
                    id="checkbox-container"
                    className="flex items-center gap-2 flex-wrap"
                  >
                    <Checkbox
                      id="rangeEvent"
                      checked={isRangeEvent}
                      onCheckedChange={handleSetRangeEvent}
                    />
                    <Label htmlFor="rangeEvent">Range Event</Label>
                  </div>

                  {isRangeEvent ? (
                    <DatePickerWithRange
                      disableDates="past"
                      className="w-full sm:max-w-[300px]"
                      defaultDate={{ from: startDate, to: endDate }}
                      onDateChange={handleSetDate}
                    />
                  ) : (
                    <DateTimeRangePicker
                      disableDates={"past"}
                      className="w-full"
                      defaultDate={{ from: startDate, to: endDate }}
                      onDateChange={handleSetDate}
                    />
                  )}
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                LabelText="Category - Priority - Status"
                Important
              >
                <div className="w-full flex flex-wrap gap-3">
                  <Select
                    onValueChange={(value) => setValue("category", value)}
                    value={category}
                  >
                    <SelectTrigger className=" min-w-[150px] flex-grow">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categoryList.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => setValue("priority", value)}
                    value={priority}
                  >
                    <SelectTrigger className="w-[30%] min-w-[150px] flex-grow">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priorities</SelectLabel>
                        {priorityList.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => setValue("status", value)}
                    value={status}
                  >
                    <SelectTrigger className="w-[30%] min-w-[150px] flex-grow">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {statusList.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper LabelText="Invite participants" Important>
                <MultiSelect
                  options={usersList}
                  defaultValue={participants}
                  onValueChange={(value) => setValue("participants", value)}
                  placeholder="Select participants"
                  variant="inverted"
                  maxCount={3}
                />
              </FormFieldWrapper>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" className="text-base font-semibold">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
