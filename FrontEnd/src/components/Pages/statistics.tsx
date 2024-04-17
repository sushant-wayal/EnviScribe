import { LineChart } from "@mui/x-charts/LineChart";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter
} from "../ui/card";
import { Button } from "../ui/button";
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import axios from "axios";
import { domain, tokenKey } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "../ui/date-picker";
import { Label } from "../ui/label";
import { toast } from "sonner";

export type Log = {
  value: string;
  timestamp: string;
  status: string;
  [key: string]: string | undefined;
}

interface StatisticsPageProps {}

const StatisticsPage: React.FC<StatisticsPageProps> = () => {
  const { deviceId, sensorId } = useParams();
  const [device, setDevice] = useState(deviceId || "");
  const [sensor, setSensor] = useState(sensorId || "");
  const [logs, setLogs] = useState<Log[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [sensors, setSensors] = useState<{
    name: string;
    id: string;
  }[]>([]);
  const [devices, setDevices] = useState<{
    name: string;
    id: string;
  }[]>([]);
  useEffect(() => {
    const fetchDevices = async () => {
      const { data : { data } } = await axios.get(`${domain}/api/v1/devices`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`,
        }
      });
      setDevices(data.map((device: any) => ({
        name: device.name,
        id: device._id
      })));
      console.log("device data",data);
      setDevice(data.filter((device: any) => device._id === device)[0]._id);
    }
    fetchDevices();
  }, []);
  useEffect(() => {
    if (!device) return;
    console.log("device", device);
    const fetchSensors = async () => {
      const { data : { data : { sensors }  } } = await axios.get(`${domain}/api/v1/devices/${device}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`,
        }
      });
      setSensors(sensors.map((sensor: any) => ({
        name: sensor.name,
        id: sensor._id
      })));
      console.log("sensor data", sensors);
      const defaultSensorId = sensors.filter((sensor: any) => sensor._id === sensorId)[0]._id;
      setSensor(defaultSensorId ? defaultSensorId : sensors[0]._id);
    }
    fetchSensors();
  }, [device]);
  const intervals = ["Hour", "Day", "Week", "Month", "Year"];
  const [interval, setInterval] = useState("Hour");
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  useEffect(() => {
    if (interval === "Hour") {
      setChartLabels(labels.map((label) => {
        const time = label.split("T")[1].substring(0, 5);
        if (!startDate || !endDate) return label;
        if (endDate?.getTime() - startDate?.getTime() <= 24 * 60 * 60 * 1000) {
          return time;
        } else if (endDate?.getTime() - startDate?.getTime() <= 30 * 24 * 60 * 60 * 1000) {
          return label.split("T")[0].split("-")[2] + "-" + time;
        } else if (endDate?.getTime() - startDate?.getTime() <= 365 * 24 * 60 * 60 * 1000) {
          return label.split("T")[0].split("-")[1] + "-" + label.split("T")[0].split("-")[2] + " " + time;
        } else {
          return label;
        }
      }));
    } else if (interval === "Day" || interval === "Week") {
      setChartLabels(labels.map((label) => label.split("T")[0]));
    } else if (interval === "Month") {
      setChartLabels(labels.map((label) => {
        const date = new Date(label);
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]+"-"+date.getFullYear().toString();
      }));
    } else if (interval === "Year") {
      setChartLabels(labels.map((label) => {
        const date = new Date(label);
        return date.getFullYear().toString();
      }));
    } else {
      setChartLabels(labels);
    }
  }, [labels, interval]);
  useEffect(() => {
    if (!device || !sensor) return;
    const fetchLogs = async () => {
      const { data : { data } } = await axios.get(`${domain}/api/v1/logs/${sensor}?startDate=${startDate}&endDate=${endDate}&interval=${interval}`);
      setLogs(data);
      setLabels(data.map((log: Log) => log.timestamp));
    };
    fetchLogs();
  }, [device, sensor, startDate, endDate, interval]);
  const convertJSONtoExcel = (jsonData : Log[]) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return excelBuffer;
  };
  const downloadExcel = (excelBuffer : any, fileName : String) => {
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const DownloadLogs = (logsDatas : Log[]) => {
    const excelBuffer = convertJSONtoExcel(logsDatas.map((logsData) => ({ ...logsData, value: logsData.value})));
    downloadExcel(excelBuffer, 'logs');
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-between w-lvw">
        { chartLabels.length == logs.length ? 
        <LineChart
          width={800}
          height={500}
          series={[
            {data : logs.map(log => parseFloat(log.value)), label: sensors.filter(sensorId => sensorId.id === sensor)[0]?.name || "No Data" },
          ]}
          xAxis={[{ scaleType: 'point', data: chartLabels}]}
        /> : null}
        <Card className="w-auto mr-10 relative">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Change Controls to see Statistical Changes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start justify-start gap-8">
            <div className="flex flex-col items-start justify-start gap-12">
              <div className="flex flex-col gap-2">
                <Label>
                  Device
                </Label>
                  <Select onValueChange={(e) => {
                    setDevice(devices.filter(device => device.id === e)[0]?.id)
                  }} defaultValue={devices[0]?.name} value={device}>
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
              </div>
              <div className="flex items-center justify-center gap-36">
                <div className="flex flex-col gap-2">
                  <Label>
                    Sensor
                  </Label>
                    <Select onValueChange={(e) => {
                    setSensor(sensors.filter(sensor => sensor.id === e)[0]?.id)
                  }} value={sensor}>
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
                </div>
                <div className="flex flex-col gap-2">
                  <Label>
                    Interval
                  </Label>
                    <Select onValueChange={(e) => {
                      setInterval(e);
                    }} value={interval}>
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
                </div>
              </div>
              <div className="flex items-center justify-center gap-[84px]">
                <div className="flex flex-col gap-2">
                  <Label>Start Date</Label>
                  <DatePicker date={startDate} setDate={setStartDate} maxDate={new Date((endDate?.getTime() || Date.now())-24*60*60*1000)}/>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>End Date</Label>
                  <DatePicker date={endDate} setDate={setEndDate} minDate={new Date((startDate?.getTime() || Date.now())+24*60*60*1000)}/>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className=" absolute bottom-0 w-full flex justify-between">
            <Button onClick={() => {
              setDevice(devices[0].id);
              setSensor(sensors[0].id);
              setStartDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
              setEndDate(new Date());
              setInterval("Hour");
            }} variant="outline">Reset</Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Download Excel</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[1002]">
                <DropdownMenuItem className="p-0 mb-2">
                  <Button className="w-full" variant="secondary" onClick={() => {
                    const toastId = toast.loading("Downloading Logs");
                    try {
                      DownloadLogs(logs);
                      toast.success("Logs Downloaded Successfully", {id: toastId});
                    } catch (error) {
                      toast.error("Error Downloading Logs", {id: toastId});
                    }
                  }}>With Intervals</Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                <Button className="w-full" variant="secondary" onClick={async () => {
                  const toastId = toast.loading("Downloading Logs");
                  try {
                    const { data : { data } } = await axios.get(`${domain}/api/v1/logs/${sensor}?startDate=${startDate}&endDate=${endDate}`);
                    DownloadLogs(data);
                    toast.success("Logs Downloaded Successfully", {id: toastId});
                  } catch (error) {
                    toast.error("Error Downloading Logs", {id: toastId});
                  }
                }}>All Data</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default StatisticsPage;