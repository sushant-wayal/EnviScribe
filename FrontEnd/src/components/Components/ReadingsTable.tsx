import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";

interface ReadingsTableProps {
  logs: {
    value: String;
    timestamp: String;
    status: String;
  }[];
  className?: string;
}

const ReadingsTable : React.FC<ReadingsTableProps> = ({ logs, className }) => {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Values</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log, index) => {
          const { value, timestamp, status } = log
          return (
            <TableRow key={index}>
              <TableCell>{value}</TableCell>
              <TableCell>{timestamp}</TableCell>
              <TableCell>{status}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
};

export default ReadingsTable;