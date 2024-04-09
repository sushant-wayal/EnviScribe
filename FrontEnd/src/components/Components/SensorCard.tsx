import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";
import { LineChart } from "@mui/x-charts/LineChart";

interface SensorCardProps {
  id: string;
  name: string;
  status: string;
  minValue: Number;
  maxValue: Number;
  logs: {
    value: Number;
    timestamp: String;
    status: String;
  }[];
}

const SensorCard : React.FC<SensorCardProps> = ({
  id,
  name,
  status,
  minValue,
  maxValue,
  logs
}) => {
  const data = logs.map((log, index) => {
    if (index >= 3) {
      return null;
    }
    return parseFloat(log.value.toString());
  });
  const labels = logs.map((log, index) => {
    if (index >= 3) {
      return null;
    }
    return log.timestamp;
  });
  return (
    <Link className="w-auto max-h-[500px] mx-auto my-5" to={`/statistics/${id}`}>
      <Card className="px-3">
        <CardHeader className="border-b-2 border-black border-solid">
          <CardTitle>{name}</CardTitle>
          <CardDescription className="flex justify-between">
            <p>Min Value: {minValue.toString()}</p>
            <p>Max Value: {maxValue.toString()}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            width={300}
            height={300}
            series={[
              {data, label: name.split(' ')[0]},
            ]}
            xAxis={[{ scaleType: 'point', data: labels }]}
            className="bg-red-600"
          />
        </CardContent>
        <CardFooter className="flex items-center gap-10 border-t-2 border-black border-solid">
          <CardDescription className="flex justify-start gap-3">
            <p>Status : </p>
            <p className="font-semibold">{status}</p>
          </CardDescription>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default SensorCard;