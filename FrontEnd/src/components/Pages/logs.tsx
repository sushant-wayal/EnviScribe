import {
  useEffect,
  useState
} from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReadingsTable from "../Components/ReadingsTable";
import Logs from "../../data/logs.json";

interface logsPageProps {}

type Log = {
  value: string;
  timestamp: string;
  status: string;
}

const LogsPage: React.FC<logsPageProps> = () => {
  const [logs, setLogs] = useState<Log[]>(Logs.logs);
  const { sensorId } = useParams();
  useEffect(() => {
    const getLogs = async () => {
      const { data } = await axios.get(`http://localhost:3000/api/v1/logs/${sensorId}`);
      setLogs(data);
    };
    getLogs();
  }, [logs]);
  return (
    <>
      <Navbar />
      <ReadingsTable logs={logs} className="w-[90vw]  mx-auto border-2 border-black border-solid rounded-full" />
    </>
  );
};

export default LogsPage;