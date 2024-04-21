import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SensorCard from "../Components/SensorCard";
import { domain, tokenKey } from "@/constants";
import Loader from "../Components/Loader";

interface SensorsPageProps {}

type Sensor = {
  id: string;
  name: string;
  minValue: number;
  maxValue: number;
  status: string;
  logStatus: string;
  logs: {
    value: Number;
    timestamp: String;
    status: String;
  }[];
}

const SensorsPage : React.FC<SensorsPageProps> = () => {
  const navigate = useNavigate();
  const { deviceId } = useParams();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if(!token) navigate("/login");
    const getSensors = async () => {
      try {
        const { data : { data } } = await axios.get(`${domain}/api/v1/sensors/${deviceId}?sensors=true`,{
          headers: {
            "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
          }
        });
        setSensors(data.map((sensor: any) => {
          const { _doc, logStatus } = sensor;
          return{
          ..._doc,
          id: _doc._id,
          logs: _doc.logs.slice(_doc.logs.length-5, _doc.logs.length).map((log: any) => ({
              ...log,
              timestamp: log.createdAt.toString().split('T')[1].substring(0,5),
            })),
          logStatus
        }}));
      } catch (error : any) {
        if (error.response.status === 404) {
          navigate('*');
        }
      }
      setLoading(false);
    };
    getSensors();
  },[]);
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-h-screen">
        {sensors.map((sensor, index) => {
          const { id, name, status, minValue, maxValue, logs, logStatus } = sensor;
          return <SensorCard key={index} deviceId={deviceId || ""} id={id} name={name} status={status} minValue={minValue} maxValue={maxValue} logs={logs} logStatus={logStatus}/>
        })}
        <Loader size={40} loading={loading} />
      </div>
    </>
  );
}

export default SensorsPage;