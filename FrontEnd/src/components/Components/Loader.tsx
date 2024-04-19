import { Loader2 } from "lucide-react";

interface LoaderProps {
  loading: boolean;
  size?: number;
  className?: string;
}

const Loader : React.FC<LoaderProps> = ({ loading, size, className }) => {
  return (
    <div className={`${loading ? "flex" : "hidden"} justify-center items-center w-full h-full absolute ${className}`}>
      <Loader2 size={size} className="animate-spin" color="green"/>
    </div>
  );
}

export default Loader;