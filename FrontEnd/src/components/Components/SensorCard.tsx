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
  deviceId: string;
  id: string;
  name: string;
  status: string;
  minValue: Number;
  maxValue: Number;
  logStatus: string;
  logs: {
    value: Number;
    timestamp: String;
    status: String;
  }[];
}

const SensorCard : React.FC<SensorCardProps> = ({
  deviceId,
  id,
  name,
  status,
  minValue,
  maxValue,
  logs,
  logStatus
}) => {
  const data = logs.map(log => parseFloat(log.value.toString()));
  const labels = logs.map(log => log.timestamp);
  return (
    <Link className="w-auto max-h-[450px] mx-auto my-5 hover:opacity-80" to={`/statistics/${deviceId}/${id}`}>
      <Card className={`px-3 ${logStatus == "normal" ? "bg-[#687a6a]" : logStatus == "warning" ? "bg-[#7a7868]" : "bg-[#7a6868]"} text-white border-0`}>
        <CardHeader className="border-b-2 border-black border-solid">
          <CardTitle>{name}</CardTitle>
          <CardDescription className="flex justify-between text-[#DDDDDD]">
            <p>Min Value: {minValue.toString()}</p>
            <p>Max Value: {maxValue.toString()}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? <LineChart
            width={250}
            height={250}
            series={[
              {data, label: name.split(' ')[0]},
            ]}
            xAxis={[{ scaleType: 'point', data: labels }]}
            className="text-white"
            colors={['#00FF00']}
          /> : <p className="text-5xl">No data available</p>}
        </CardContent>
        <CardFooter className="flex items-center gap-10 border-t-2 border-black border-solid">
          <CardDescription className="flex justify-start gap-3 text-[#DDDDDD]">
            <p>Status : </p>
            <p className="font-semibold">{status}</p>
          </CardDescription>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default SensorCard;