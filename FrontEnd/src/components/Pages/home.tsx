import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar"
import axios from "axios"
import DeviceCard from "../Components/DeviceCard";
import Map from "../Components/Map";
import { domain, tokenKey } from "@/constants";
import AddDevice from "../Components/AddDevice";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";

interface HomePageProps {}

export type Device = {
  id: string;
  name: string;
  location: {
    latitude: number,
    longitude: number
  };
  sensors: Array<string>;
  status: string;
}

const HomePage : React.FC<HomePageProps> = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if(!token) navigate("/login");
    const getDevices = async () => {
      const { data : { data } } = await axios.get(`${domain}/api/v1/devices/`,{
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
        }
      });
      const fetcedDevices = data.map((device: any) => ({
        id: device._id,
        name: device.name,
        location: device.location,
        sensors: device.sensors.map((sensor: any) => sensor._id),
        status: device.status
      }));
      setDevices(fetcedDevices);
      setLoading(false);
    };
    getDevices();
  },[devices.length]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="relative">
        <AddDevice work="add" setDevices={setDevices}/>
        <Map
          zoom={13}
          markers={devices.map(device => ({
            position: [device.location.latitude,device.location.longitude],
            popup: device.name,
            status: device.status
          }))}
        />
      </div>
      <div className="flex flex-col items-center gap-3 relative flex-grow">
        {devices.map(device => {
          const { id, name, location, sensors, status } = device;
          return <DeviceCard key={id} id={id} name={name} status={status} location={location} sensors={sensors.length} setDevices={setDevices}/>;
        })}
        <Loader size={30} loading={loading} />
      </div>
    </div>
  )
}

export default HomePage