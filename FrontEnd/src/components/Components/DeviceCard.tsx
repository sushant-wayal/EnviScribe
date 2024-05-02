import { Link } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteAlertDialog from "./DeleteAlertDialog";
import AddDevice from "./AddDevice";
import { Dispatch, SetStateAction } from "react";
import { Device } from "../Pages/home";
import Badge from "./Badge";


interface DeviceCardProps {
  id: string;
  name: string;
  status: string;
  location: {
    latitude: number,
    longitude: number
  };
  sensors: Number;
  setDevices: Dispatch<SetStateAction<Device[]>>;
}

const DeviceCard : React.FC<DeviceCardProps> = ({
  id,
  name,
  status,
  location : { latitude, longitude },
  sensors,
  setDevices
}) => {
  return (
    <Link className="mx-10 max-w-[1300px] w-[70%] sm:w-[90%] hover:opacity-80" to={`/device/${id}`}>
      <Card className={`flex flex-col md:flex-row justify-center gap-3 sm:justify-between h-auto sm:h-24 py-2 md:py-1 md:h-auto items-center mx-5 ${status == "normal" ? "bg-green-600" : status == "warning" ? "bg-yellow-600" : "bg-red-600"} border-0`}>
        <CardHeader className="flex flex-row gap-3 items-center justify-center p-0 md:p-6">
          <CardTitle>{name}</CardTitle>
          <CardDescription><Badge content={status}/></CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-5 lg:gap-10 p-0 pr-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <div className="flex items-center justify-center gap-3">
              <CardDescription className="text-center">
                <Badge className="hidden sm:block" content={`${latitude.toString()}  Latitude`}/>
                <Badge className="sm:hidden" content={latitude.toString()}/>
              </CardDescription>
              <CardDescription className="text-center">
                <Badge className="hidden sm:block" content={`${longitude.toString()}  Longitude`}/>
                <Badge className="sm:hidden" content={longitude.toString()}/>
              </CardDescription>
            </div>
            <div className="flex flex-row justify-between gap-3">
              <CardDescription><Badge className="bg-gray-400" content={`${sensors.toString()} sensors`}/></CardDescription>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <DropdownMenuLabel><div className="rounded-full h-5 w-5 border-2 border-black border-solid flex justify-center items-center"><p>⋮</p></div></DropdownMenuLabel>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-[1002] bg-transparent border-0">
                  <DropdownMenuItem className="p-0 mb-0">
                    <AddDevice work="edit" deviceId={id} setDevices={setDevices}/>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <DeleteAlertDialog deviceId={id} setDevices={setDevices}/>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DeviceCard;