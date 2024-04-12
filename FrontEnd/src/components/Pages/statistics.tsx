import { LineChart } from "@mui/x-charts/LineChart";
import logsdata from "../../data/logs.json";
import Navbar from "../Components/Navbar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import { domain } from "@/constants";
// import axios from "axios";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter
} from "../ui/card";
import { Label } from "../ui/label";
// import { Button } from "react-day-picker";
import { Button } from "../ui/button";
import Map from "../Components/Map";
import Devices from "../../data/devices.json";

interface StatisticsPageProps {}

const StatisticsPage: React.FC<StatisticsPageProps> = () => {
  // const { sensorId } = useParams();
  const [logs, setLogs] = useState(logsdata.logs.map((log) => log.value));
  const [labels, setLabels] = useState(logsdata.logs.map((log) => log.timestamp));
  const [sensors, setSensors] = useState(["Temperature", "Humidity", "Pressure", "Light", "Moisture"]);
  const [devices, setDevices] = useState(Devices.devices.map((device) => device.name));
  const [sensor, setSensor] = useState("Temperature");
  const [intervals, setIntervals] = useState(["Hour", "Day", "Week", "Month", "Year"]);
  const [interval, setInterval] = useState("Hour");
  const calculateCenter = (): number[] => {
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].status === "Danger") {
        return [devices[i].location.latitude, devices[i].location.longitude];
      }
    }
    return [devices[0].location.latitude, devices[0].location.longitude];
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-between w-lvw">
        <LineChart
          width={800}
          height={500}
          series={[
            {data : logs, label: "Temperature"},
          ]}
          xAxis={[{ scaleType: 'point', data: labels }]}
        />
        <Card className="w-auto mr-10 relative">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Change Controls to see Statistical Changes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start justify-start gap-8">
            <div className="flex flex-col items-start justify-start gap-3">
              <Label>Device</Label>
              <Select defaultValue={"Device 1"}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Device" />
                </SelectTrigger>
                <SelectContent onChange={(e) => console.log("e",e.target)}>
                  {devices.map((device) => <SelectItem key={device} value={device}>{device}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center gap-36">
              <div className="flex flex-col items-start justify-start gap-3">
                <Label>Sensor</Label>
                <Select defaultValue={sensor}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Sensor" />
                  </SelectTrigger>
                  <SelectContent onChange={(e) => console.log("e",e.target)}>
                    {sensors.map((sensor) => <SelectItem key={sensor} value={sensor}>{sensor}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col items-start justify-start gap-3">
                <Label>Interval</Label>
                <Select defaultValue={interval}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {intervals.map((interval) => <SelectItem key={interval} value={interval}>{interval}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-3">
              <Label>Date Range</Label>
              <DatePickerWithRange
                startDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
                endDate={new Date()}
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col items-start justify-start gap-3 w-[40%]">
                <Label>Start Date</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[0]}
                />
              </div>
              <div className="flex flex-col items-start justify-start gap-3 w-[40%]">
                <Label>End Date</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[0]}
                />
              </div>
            </div>
            {/* <Map
              center={calculateCenter()}
              zoom={10}
              markers={devices.map(device => ({
                position: [device.location.latitude,device.location.longitude],
                popup: device.name,
                status: device.status
              }))}
              className="w-full h-[100px] rounded-md"
            /> */}
          </CardContent>
          <CardFooter className=" absolute bottom-0 w-full flex justify-between">
            <Button variant="outline">Reset</Button>
            <Button>Download Excel</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default StatisticsPage;