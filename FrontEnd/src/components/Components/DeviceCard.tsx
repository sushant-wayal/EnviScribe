import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface DeviceCardProps {
  id: string;
  name: string;
  status: string;
  location: string;
  sensors: Number;
}

const DeviceCard : React.FC<DeviceCardProps> = ({
  id,
  name,
  status,
  location,
  sensors
}) => {
  return (
    <Link className="mx-5" to={`/device/${id}`}>
      <Card className="flex justify-between items-center">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          {status}
        </CardContent>
        <CardFooter className="flex items-center gap-10">
          <CardDescription>{location}</CardDescription>
          <CardDescription>{sensors.toString()} sensors</CardDescription>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DeviceCard;