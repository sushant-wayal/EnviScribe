import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "../ui/date-picker";
import { useEffect } from "react";

interface ControlFormProps {
  resetFlag: boolean;
}

const ControlForm: React.FC<ControlFormProps> = ({ resetFlag }) => {
  const sensors = ["Temperature", "Humidity", "Pressure", "Light", "Moisture"];
  const devices = Devices.devices.map((device) => device.name);
  const intervals = ["Hour", "Day", "Week", "Month", "Year"];
  const defaultValues = {
    deviceName: "Device 1",
    sensorName: "Temperature",
    interval: "Hour",
    startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    endDate: new Date()
  }
  const form = useForm({
    defaultValues
  });
  useEffect(() => {
    form.reset(defaultValues);
  }, [resetFlag]);
  return (
    <Form {...form}>
      <form className="flex flex-col items-start justify-start gap-12">
        <FormField
          control={form.control}
          name="deviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Device
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={form.getValues().deviceName}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => <SelectItem key={device} value={device}>{device}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center gap-36">
          <FormField
            control={form.control}
            name="sensorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sensor
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={form.getValues().sensorName}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Sensor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensors.map((sensor) => <SelectItem key={sensor} value={sensor}>{sensor}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Interval
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={form.getValues().interval}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {intervals.map((interval) => (
                        <SelectItem key={interval} value={interval}>
                          {interval}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-center gap-[84px]">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DatePicker field={field}/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <DatePicker field={field}/>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default ControlForm;