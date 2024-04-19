import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { Dispatch, SetStateAction } from "react";

interface DatePickerProps {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  maxDate?: Date;
  minDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate, maxDate, minDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !date && "text-muted-foreground",
            "text-[#444444]"
          )}
        >
          {date ? (
            format(date, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) =>
            date > (maxDate || new Date(new Date().getTime() + 24*30*3*60*60*1000)) || date < (minDate || new Date("1900-01-01"))
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;