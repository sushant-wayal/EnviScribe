import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Button } from "../ui/button";
import { ArrowLeftCircleIcon } from "lucide-react";

interface NotFoundPageProps {}

const NotFoundPage : React.FC<NotFoundPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[88.5vh] w-lvw">
      <Navbar/>
      <img className="h-[60vh] w-full" src="../../../not_found.svg" alt="Not Found" />
      <div className="flex justify-center mt-10 gap-8">
        <h1 className="text-center text-2xl text-green-600">Requested Information Is not Available</h1>
        <Button className="bg-green-600" onClick={() => {
          navigate("/home");
        }
        }><ArrowLeftCircleIcon className="mr-2"/>Go Back</Button>
      </div>
    </div>
  )
}

export default NotFoundPage;