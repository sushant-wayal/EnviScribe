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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { domain } from "@/constants";
import axios from "axios";
import { Log } from "../Pages/statistics";

interface ControlFormProps {
  resetFlag: boolean;
  deviceId: string;
  sensorId: string;
  setLogs: Dispatch<SetStateAction<Log[]>>;
  setLabels: Dispatch<SetStateAction<string[]>>;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
  setSensorId: Dispatch<SetStateAction<string>>;
}

const ControlForm: React.FC<ControlFormProps> = ({ resetFlag, deviceId, sensorId, setLogs, setLabels, setStartDate, setEndDate, setSensorId }) => {
  const defaultValues = {
    deviceName: "",
    sensorName: "",
    interval: "Hour",
    startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    endDate: new Date()
  }
  const form = useForm({
    defaultValues
  });
  const [sensors, setSensors] = useState<{
    name: string;
    id: string;
  }[]>([]);
  const [devices, setDevices] = useState<{
    name: string;
    id: string;
  }[]>([]);
  useEffect(() => {
    setStartDate(form.getValues().startDate);
  }, [form.getValues().startDate]);
  useEffect(() => {
    setEndDate(form.getValues().endDate);
  }, [form.getValues().endDate]);
  useEffect(() => {
    setSensorId(form.getValues().sensorName);
  }, [form.getValues().sensorName]);
  useEffect(() => {
    const fetchDevices = async () => {
      const { data } = await axios.get(`${domain}/devices`);
      setDevices(data.map((device: any) => {
        device.name,
        device._id
      }));
      form.setValue("deviceName", data.filter((device: any) => device.id === deviceId)[0]._id);
    }
    fetchDevices();
  }, []);
  useEffect(() => {
    const fetchSensors = async () => {
      const { data : { sensors } } = await axios.get(`${domain}/devices/${form.getValues().deviceName}`);
      setSensors(sensors.map((sensor: any) => {
        sensor.name,
        sensor._id
      }));
      const defaultSensorId = sensors.filter((sensor: any) => sensor.id === sensorId)[0]._id;
      form.setValue("sensorName", defaultSensorId ? defaultSensorId : sensors[0]._id);
    }
    fetchSensors();
  }, [form.getValues().deviceName]);
  const intervals = ["Hour", "Day", "Week", "Month", "Year"];
  const fetchLogs = async () => {
    const { data } = await axios.get(`${domain}/api/v1/logs/${form.getValues().sensorName}?startDate=${form.getValues().startDate}&endDate=${form.getValues().endDate}&interval=${form.getValues().interval}`);
    setLogs(data);
    setLabels(data.map((log: Log) => log.timestamp));
  };
  useEffect(() => {
    const currDeviceId = form.getValues().deviceName;
    const currSensorId = form.getValues().sensorName;
    const startDate = form.getValues().startDate;
    const endDate = form.getValues().endDate;
    const interval = form.getValues().interval;
    if (currDeviceId && currSensorId && startDate && endDate && interval) {
      fetchLogs();
    }
  },[form.getValues()]);
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
                <Select onValueChange={field.onChange} defaultValue={field.value} value={devices.filter(device => device.id === form.getValues().deviceName)[0].name}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => {
                      const { name, id } = device;
                      return <SelectItem key={id} value={id}>{name}</SelectItem>
                    })}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={sensors.filter(sensor => sensor.id === form.getValues().sensorName)[0].name}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Sensor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensors.map((sensor) => {
                        const { name, id } = sensor;
                        return <SelectItem key={id} value={id}>{name}</SelectItem>
                      })}
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