import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
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
    <Link className="mx-10" to={`/device/${id}`}>
      <Card className="flex justify-between items-center mx-5">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          {status}
        </CardContent>
        <CardFooter className="flex items-center gap-10" onClick={(e) => e.stopPropagation()}>
          <CardDescription className="text-center">{latitude}</CardDescription>
          <CardDescription className="text-center">{longitude}</CardDescription>
          <CardDescription>{sensors.toString()} sensors</CardDescription>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <DropdownMenuLabel>⋮</DropdownMenuLabel>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[1002]">
              <DropdownMenuItem className="p-0 mb-2">
                <AddDevice work="edit" deviceId={id} setDevices={setDevices}/>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <DeleteAlertDialog/>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DeviceCard;