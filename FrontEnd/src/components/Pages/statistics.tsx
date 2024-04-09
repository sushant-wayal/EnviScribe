import { LineChart } from "@mui/x-charts/LineChart";
import logs from "../../data/logs.json";
import Navbar from "../Components/Navbar";

interface StatisticsPageProps {}

const StatisticsPage: React.FC<StatisticsPageProps> = () => {
  const data = logs.logs.map((log, index) => {
    if (index >= 10) {
      return null;
    }
    return log.value;
  });
  const labels = logs.logs.map((log, index) => {
    if (index >= 10) {
      return null;
    }
    return log.timestamp;
  });
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