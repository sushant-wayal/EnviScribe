import { LineChart } from "@mui/x-charts/LineChart";
import logs from "../../data/logs.json";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface StatisticsPageProps {}

const StatisticsPage: React.FC<StatisticsPageProps> = () => {
  const { sensorId } = useParams();
  const [noOfPoints, setNoOfPoints] = useState<number>(24);
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  useEffect(() => {
    const data = [];
    for (let i = 0; i < noOfPoints; i++) {
      data.push(parseFloat(logs.logs[i].value.toString()));
    }
    setData(data);
    const labels = [];
    for (let i = 0; i < noOfPoints; i++) {
      labels.push(logs.logs[i].timestamp);
    }
    setLabels(labels);
  }, [data, labels, noOfPoints]);
  return (
    <>
      <Navbar />
      <LineChart
        width={800}
        height={500}
        series={[
          {data, label: "Temperature"},
        ]}
        xAxis={[{ scaleType: 'point', data: labels }]}
      />
    </>
  );
};

export default StatisticsPage;