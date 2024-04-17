import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import SensorCard from "../Components/SensorCard";
import { domain } from "@/constants";
import Loader from "../Components/Loader";

interface SensorsPageProps {}

type Sensor = {
  id: string;
  name: string;
  minValue: number;
  maxValue: number;
  status: string;
  logs: {
    value: Number;
    timestamp: String;
    status: String;
  }[];
}

const SensorsPage : React.FC<SensorsPageProps> = () => {
  const { deviceId } = useParams();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getSensors = async () => {
      const { data : { data } } = await axios.get(`${domain}/api/v1/sensors/${deviceId}`);
      setSensors(data.map((sensor: any) => ({
        ...sensor,
        id: sensor._id,
        logs: sensor.logs.slice(sensor.logs.length-5, sensor.logs.length).map((log: any) => ({
            ...log,
            timestamp: log.createdAt.toString().split('T')[1].substring(0,5),
          }))
      })));
      setLoading(false);
    };
    getSensors();
  },[]);
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-4 min-h-screen">
        {sensors.map((sensor, index) => {
          const { id, name, status, minValue, maxValue, logs } = sensor;
          return <SensorCard key={index} deviceId={deviceId || ""} id={id} name={name} status={status} minValue={minValue} maxValue={maxValue} logs={logs} />
        })}
        <Loader size={40} loading={loading} />
      </div>
    </>
  );
}

export default SensorsPage;