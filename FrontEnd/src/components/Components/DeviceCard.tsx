import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

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
    <Link className="mx-5" to={`/device/${id}`}>
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
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DeviceCard;