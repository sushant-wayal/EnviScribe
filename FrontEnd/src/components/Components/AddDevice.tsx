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

interface AddDeviceProps {
  setDevices: Dispatch<SetStateAction<Device[]>>;
}

const AddDevice : React.FC<AddDeviceProps> = ({ setDevices }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="absolute z-[1000] top-2 right-14 bg-green-600">
          Add Device
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[1002]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Add New Device
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <AddDeviceForm setDevices={setDevices}/>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddDevice;