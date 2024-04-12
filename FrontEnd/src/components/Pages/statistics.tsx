import { LineChart } from "@mui/x-charts/LineChart";
import logsdata from "../../data/logs.json";
import Navbar from "../Components/Navbar";
import { useState } from "react";
import { useParams } from "react-router-dom";
// import { domain } from "@/constants";
// import axios from "axios";
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

type Log = {
  value: string;
  timestamp: string;
  status: string;
  [key: string]: string | undefined;
}

interface StatisticsPageProps {}

const StatisticsPage: React.FC<StatisticsPageProps> = () => {
  const { sensorId } = useParams();
  const [logs, setLogs] = useState(logsdata.logs.map((log) => log.value));
  const [labels, setLabels] = useState(logsdata.logs.map((log) => log.timestamp));
  const [resetFlag, setResetFlag] = useState(false);
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
  const DownloadLogs = () => {
    const excelBuffer = convertJSONtoExcel(logsdata.logs.map((log) => ({ ...log, value: log.value.toString()})));
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
            <ControlForm resetFlag={resetFlag}/>
          </CardContent>
          <CardFooter className=" absolute bottom-0 w-full flex justify-between">
            <Button onClick={() => setResetFlag(prev => !prev)} variant="outline">Reset</Button>
            <Button onClick={DownloadLogs}>Download Excel</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default StatisticsPage;