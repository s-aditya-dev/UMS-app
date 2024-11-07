import React, { useState, useEffect } from "react";
import { isBefore, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  disablePastDates?: boolean;
  className?: string;
  defaultDate?: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({
  disablePastDates = false,
  defaultDate,
  onDateChange,
  className,
}: DatePickerProps) {
  // useStates
  const [date, setDate] = useState<Date>();

  // useEffects
  useEffect(() => {
    if (defaultDate instanceof Date) setDate(defaultDate);
  }, [defaultDate]);

  // handlers
  const disablePast = (date: Date) => {
    return disablePastDates ? isBefore(date, new Date()) : false;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          disabled={disablePast}
        />
      </PopoverContent>
    </Popover>
  );
}
