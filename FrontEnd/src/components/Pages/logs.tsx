import {
  useEffect,
  useState
} from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReadingsTable from "../Components/ReadingsTable";
import * as XLSX from 'xlsx';
import { domain } from "@/constants";

interface logsPageProps {}

type Log = {
  value: string;
  timestamp: string;
  status: string;
  [key: string]: string | undefined;
}

const LogsPage: React.FC<logsPageProps> = () => {
  const [logs, setLogs] = useState<Log[]>(Logs.logs.map((log) => ({ ...log, value: log.value.toString()})));
  const { sensorId } = useParams();

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
    const excelBuffer = convertJSONtoExcel(logs);
    downloadExcel(excelBuffer, 'logs');
  };
  useEffect(() => {
    const getLogs = async () => {
      const { data } = await axios.get(`${domain}/api/v1/logs/${sensorId}`);
      setLogs(data);
    };
    getLogs();
  }, [logs]);
  return (
    <>
      <Navbar />
      <button onClick={DownloadLogs} className="w-[150px] mx-[100px] my-5 bg-blue-500 text-white rounded-full p-2">Download Logs</button>
      <ReadingsTable logs={logs} className="w-[90vw]  mx-auto border-2 border-black border-solid rounded-full" />
    </>
  );
};

export default LogsPage;