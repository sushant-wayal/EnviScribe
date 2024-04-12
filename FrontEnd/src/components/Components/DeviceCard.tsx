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
import { Pencil } from "lucide-react";
import DeleteAlertIcon from "./DeleteAlertIcon";


interface DeviceCardProps {
  id: string;
  name: string;
  status: string;
  location: {
    latitude: number,
    longitude: number
  };
  sensors: Number;
}

const DeviceCard : React.FC<DeviceCardProps> = ({
  id,
  name,
  status,
  location : { latitude, longitude },
  sensors
}) => {
  return (
    <Link className="mx-10" to={`/device/${id}`}>
      <Card className="flex justify-between items-center">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          {status}
        </CardContent>
        <CardFooter className="flex items-center gap-10">
          <CardDescription className="text-center">{latitude}</CardDescription>
          <CardDescription className="text-center">{longitude}</CardDescription>
          <CardDescription>{sensors.toString()} sensors</CardDescription>
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <DropdownMenuLabel>⋮</DropdownMenuLabel>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="flex justify-start items-center gap-3">
                <Pencil size={15}/>
                <p>Edit</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DeleteAlertIcon/>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DeviceCard;