import { useState, ReactNode, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { EventType } from "../calendar/calendarFunc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange, DateTimeRangePicker } from "@/components/custom ui/date-time-pickers";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/custom ui/multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateRange } from "react-day-picker";
import moment from "moment";

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

type FormFields = {
  id: string | null;
  title: string;
  description: string;
  start: Date;
  end: Date;
  month_year: string;
  assignedBy: string;
  category: string;
  priority: string;
  status: string;
  participants: string[];
};

interface TaskFormProps {
  children: ReactNode;
  initialEvent?: EventType | null;
  initialData?: TaskFormMetadataType | null;
}

export const TaskForm = ({ children, initialEvent = null, initialData = null }: TaskFormProps) => {
  //useForm hook
  const { register, handleSubmit, setValue, watch } = useForm<FormFields>({
    defaultValues: {
      id: initialEvent?.id || null,
      title: initialEvent?.title || "",
      description: initialEvent?.description || "",
      start: initialEvent?.start || new Date(),
      end: initialEvent?.end || new Date(),
      month_year: initialEvent?.month_year || "",
      assignedBy: initialEvent?.assignedBy || "",
      category: initialEvent?.category || "",
      priority: initialEvent?.priority || "",
      status: initialEvent?.status || "",
      participants: initialEvent?.participants || [],
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
  const categoryList = initialData ? initialData.categoryList : ["Exams", "Testing"];
  const priorityList = initialData ? initialData.priorityList : ["High", "Medium", "Low"];
  const statusList = initialData ? initialData.statusList : ["Incomplete", "Complete", "Canceled"];

  // useEffect
  useEffect(() => {
    if (!moment(startDate).isSame(endDate, "day")) setIsRangeEvent(true);
  }, [startDate, endDate]);

  // Event Handlers
  const onSave: SubmitHandler<FormFields> = (data) => {
    console.log("Form Submitted Data:", data);
  };

  const handleSetDate = (date: DateRange) => {
    if (date.from && date.to) {
      setValue("start", date.from);
      setValue("end", date.to);
      setValue("month_year", (startDate.getMonth() + 1).toString());
    }
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
              <FormFieldWrapper LabelText="Title" LabelFor="titleInput" Important>
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
                  <div id="checkbox-container" className="flex items-center gap-2 flex-wrap">
                    <Checkbox
                      id="rangeEvent"
                      checked={isRangeEvent}
                      onCheckedChange={() => setIsRangeEvent(!isRangeEvent)}
                    />
                    <Label htmlFor="rangeEvent">Range Event</Label>
                  </div>

                  {isRangeEvent ? (
                    <DatePickerWithRange
                      disablePastDates
                      className="w-full sm:max-w-[300px]"
                      defaultDate={{ from: startDate, to: endDate }}
                      onDateChange={handleSetDate}
                    />
                  ) : (
                    <DateTimeRangePicker
                      disablePastDates
                      className="w-full"
                      defaultDate={{ from: startDate, to: endDate }}
                      onDateChange={handleSetDate}
                    />
                  )}
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper LabelText="Category - Priority - Status" Important>
                <div className="w-full flex flex-wrap gap-3">
                  <Select onValueChange={(value) => setValue("category", value)} value={category}>
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
                  <Select onValueChange={(value) => setValue("priority", value)} value={priority}>
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
                  <Select onValueChange={(value) => setValue("status", value)} value={status}>
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
