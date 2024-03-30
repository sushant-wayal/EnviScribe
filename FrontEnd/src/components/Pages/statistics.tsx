import { LineChart } from "@mui/x-charts/LineChart";
import logs from "../../data/logs.json";

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
    <div>
      <LineChart
        width={1500}
        height={500}
        series={[
          {data, label: "Temperature"},
        ]}
        xAxis={[{ scaleType: 'point', data: labels }]}
        sx={{
          '.MuiLineElement-root, .MuiMarkElement-root': {
            strokeWidth: 1,
          },
          '.MuiLineElement-series-pvId': {
            strokeDasharray: '5 5',
          },
          '.MuiLineElement-series-uvId': {
            strokeDasharray: '3 4 5 2',
          },
          '.MuiMarkElement-root:not(.MuiMarkElement-highlighted)': {
            fill: '#fff',
          },
          '& .MuiMarkElement-highlighted': {
            stroke: 'none',
          },
        }}
      />
    </div>
  );
};

export default StatisticsPage;