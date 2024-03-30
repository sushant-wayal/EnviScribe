import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar"
import axios from "axios"
import DeviceCard from "../Components/DeviceCard";
import Devices from "../../data/devices.json";

interface HomePageProps {}

type Device = {
  id: string;
  name: string;
  location: string;
  sensors: Array<string>;
}

const HomePage : React.FC<HomePageProps> = () => {
  const [devices, setDevices] = useState<Device[]>(Devices.devices);
  useEffect(() => {
    const getDevices = async () => {
      const { data } = await axios.get("http://localhost:3000/api/v1/devices");
      setDevices(data);
    };
    getDevices();
  },[devices]);
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-3">
        {devices.map(device => {
          const { id, name, location, sensors } = device;
          return <DeviceCard key={id} id={id} name={name} status={"Normal"} location={location} sensors={sensors.length} />;
        })}
      </div>
    </>
  )
}

export default HomePage