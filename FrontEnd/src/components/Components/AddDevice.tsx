import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AddDeviceForm from "./AddDeviceForm";
import { Device } from "../Pages/home";
import { Dispatch, SetStateAction } from "react";
import { Pencil } from "lucide-react";

interface AddDeviceProps {
  work: "add" | "edit";
  setDevices: Dispatch<SetStateAction<Device[]>>;
  deviceId?: string;
}

const AddDevice : React.FC<AddDeviceProps> = ({ work, setDevices, deviceId }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={work == "add" ? "default" : "outline"}
          className={`${work == "add" ? "absolute z-[1000] top-2 right-14 bg-green-600" : "w-full flex justify-start p-1 gap-3 items-center"}`}
          onClick={work == "add" ? () => {} : (e) => {e.stopPropagation()}}
        >
          {work == "add" ? 
            "Add Device" : 
            <>
              <Pencil size={15}/>
              <p>Edit</p>
            </>
          }
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[1002] bg-[#444444] text-white border-0" onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Add New Device
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <AddDeviceForm setDevices={setDevices} deviceId={deviceId}/>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddDevice;