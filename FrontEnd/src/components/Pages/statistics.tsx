import { LineChart } from "@mui/x-charts/LineChart";
import Navbar from "../Components/Navbar";
import { useState } from "react";
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
import ControlForm from "../Components/ControlForm";
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import axios from "axios";
import { domain } from "@/constants";

export type Log = {
  value: string;
  timestamp: string;
  status: string;
  [key: string]: string | undefined;
}

interface StatisticsPageProps {}

const StatisticsPage: React.FC<StatisticsPageProps> = () => {
  const { deviceId, sensorId } = useParams();
  const [logs, setLogs] = useState<Log[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [resetFlag, setResetFlag] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [sensor, setSensor] = useState(sensorId || "");
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
        <LineChart
          width={800}
          height={500}
          series={[
            {data : logs.map(log => parseFloat(log.value)), label: "Temperature"},
          ]}
          xAxis={[{ scaleType: 'point', data: labels }]}
        />
        <Card className="w-auto mr-10 relative">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Change Controls to see Statistical Changes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start justify-start gap-8">
            <ControlForm deviceId={deviceId || ""} sensorId={sensorId || ""} resetFlag={resetFlag} setLabels={setLabels} setLogs={setLogs} setStartDate={setStartDate} setEndDate={setEndDate} setSensorId={setSensor}/>
          </CardContent>
          <CardFooter className=" absolute bottom-0 w-full flex justify-between">
            <Button onClick={() => setResetFlag(prev => !prev)} variant="outline">Reset</Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Download Excel</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[1002]">
                <DropdownMenuItem className="p-0 mb-2">
                  <Button variant="secondary" onClick={() => DownloadLogs(logs)}>With Intervals</Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                <Button variant="secondary" onClick={async () => {
                  const { data } = await axios.get(`${domain}/api/v1/logs/${sensor}?startDate=${startDate}&endDate=${endDate}`);
                  DownloadLogs(data);
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