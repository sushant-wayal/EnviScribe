import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";
import ReadingsTable from "./ReadingsTable";

interface SensorCardProps {
  id: string;
  name: string;
  status: string;
  minValue: Number;
  maxValue: Number;
  logs: {
    value: String;
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
  return (
    <Link className="w-[300px] max-h-[500px] mx-auto my-5" to={`/sensor/${id}`}>
      <Card className="px-3">
        <CardHeader className="border-b-2 border-black border-solid">
          <CardTitle>{name}</CardTitle>
          <CardDescription className="flex justify-between">
            <p>Min Value: {minValue.toString()}</p>
            <p>Max Value: {maxValue.toString()}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* <div className="flex justify-between">
            <p className="font-semibold">Reading</p>
            <p className="font-semibold">Timestamp</p>
          </div>
          {logs.map((log, index) => {
            const { value, timestamp } = log
            return <div key={index} className="flex justify-between">
              <p>{value.toString()}</p>
              <p>{timestamp.toString()}</p>
            </div>
          })} */}
          <ReadingsTable logs={logs} />
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