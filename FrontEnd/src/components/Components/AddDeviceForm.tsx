import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddDeviceFormSchema } from "@/zodSchemas";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import axios from "axios";
import { domain, tokenKey } from "@/constants";
import { Device } from "../Pages/home";
import { toast } from "sonner";

interface AddDeviceFormProps {
  setDevices: Dispatch<SetStateAction<Device[]>>;
  deviceId?: string;
}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({ setDevices, deviceId }) => {
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  useEffect(() => {
    if (deviceId) {
      const getDevice = async () => {
        const { data : { data : { name, location : { longitude, latitude }, sensors } } } = await axios.get(`${domain}/api/v1/devices/${deviceId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
          }
        });
        form.setValue("deviceName", name);
        form.setValue("longitude", longitude.toString());
        form.setValue("latitude", latitude.toString());
        form.setValue("sensors", sensors);
        setSelectedSensors(sensors.map((sensor: any) => sensor.name));
      }
      getDevice();
    }
  },[deviceId])
  const form = useForm<z.infer<typeof AddDeviceFormSchema>>({
    resolver: zodResolver(AddDeviceFormSchema),
    defaultValues:  {
      deviceName: "",
      longitude: "",
      latitude: "",
      sensors: []
    }
  });
  const alertDialogAction = useRef<HTMLButtonElement>(null)
  const search = useRef<HTMLDivElement>(null);
  const [sensorName, setSensorName] = useState<string>("")
  const [fetchedSensors, setFetchedSensors] = useState<string[]>([]);
  const getSensors = async (query : string) => {
    const { data : { data } } = await axios.get(`${domain}/api/v1/sensors${deviceId ? `/${deviceId}` : ""}?query=${query}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
      }
    });
    setFetchedSensors([...new Set((data as { _doc: { name: string } }[]).map((sensor) => sensor._doc.name))]);
    setFetchedSensors(prev => prev.filter((sensor) => !selectedSensors.includes(sensor)));
    search.current?.classList.add("flex");
    search.current?.classList.remove("hidden");
  }
  const addSensor = (sensor: string) => {
    setSelectedSensors((prev) => [sensor, ...prev])
    setSensorName("")
  }
  useEffect(() => {
    const { submitCount, errors : { sensors, deviceName, latitude, longitude } } = form.formState;
    if (submitCount > 0 && sensors == undefined && deviceName == undefined && longitude == undefined && latitude == undefined) {
      alertDialogAction.current?.click()
    }
  }, [form.formState.submitCount])
  const onSubmit = async(values: z.infer<typeof AddDeviceFormSchema>) => {
    const toastId = toast.loading(deviceId ? "Saving Changes..." : "Adding New Device...")
    try {
      const { deviceName, longitude, latitude, sensors } = values;
      const { data : { data }} = await axios.post(`${domain}/api/v1/devices/add`, {
        name: deviceName,
        location: {
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude)
        },
        sensors
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(tokenKey)}`
        }
      });
      if (data) {
        form.reset();
        setSelectedSensors([]);
        !deviceId ? setDevices(prev => [...prev, data]) : setDevices(prev => prev.map(device => device.id == deviceId ? data : device));
      }
      toast.success(`${deviceId ? "Changes Saved" : "Device Added"} Successfully`, { id: toastId })
    } catch (error : any) {
      toast.error(`Error ${deviceId ? "Saving Changes" : "Adding Device"} : ${error.response.data.message || "Try Again"}`, { id: toastId })
    }
  }
  return (
    <Form {...form}>
      <form
        id = "addDeviceForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField 
          control={form.control}
          name="deviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Device Name{deviceId ? "" : " (Can set it only once, its Irreversible)"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Device Name"
                  readOnly={deviceId ? true : false}
                  {...field}
                  className="bg-white placeholder:text-[#444444] text-[#222222]"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-between gap-2">
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Longitude
                </FormLabel>
                <FormControl>
                  <Input
                    readOnly={deviceId ? true : false}
                    type="number"
                    placeholder="Longitude"
                    {...field}
                    className="bg-white placeholder:text-[#444444] text-[#222222]"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Latitude
                </FormLabel>
                <FormControl>
                  <Input
                    readOnly={deviceId ? true : false}
                    type="number"
                    placeholder="Latitude"
                    {...field}
                    className="bg-white placeholder:text-[#444444] text-[#222222]"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <FormItem className="flex-grow">
          <FormLabel>
            Sensors
          </FormLabel>
          <FormControl>
            <div className="flex w-full gap-2 items-center">
              <Search/>
              <div className="flex-grow relative">
                <Input
                  type="text"
                  placeholder="Search Sensors"
                  value={sensorName}
                  onChange={(e) => {
                    const curr = e.target.value
                    setSensorName(() => curr)
                    getSensors(curr);
                  }}
                  className="bg-white placeholder:text-[#444444] text-[#222222]"
                />
                <div className={`absolute top-[100%] w-full max-h-[100px] ${sensorName == "" ? "hidden" : "flex"} flex-col border-black border-solid rounded bg-white  overflow-x-auto text-[#222222] ${fetchedSensors.length != 0 ? "border-2 p-2" : ""}`} ref={search}>
                  {fetchedSensors.map((sensor, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        addSensor(sensor);
                        form.setValue("sensors", [...selectedSensors, sensor])
                        search.current?.classList.add("hidden");
                        search.current?.classList.remove("flex");
                      }}
                      className="hover:bg-green-400/50 p-1"
                    >
                      {sensor}
                    </p>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setSensorName("");
                  search.current?.classList.add("hidden");
                  search.current?.classList.remove("flex");
                }}
                variant={"destructive"}
              >
                x
              </Button>
            </div>
          </FormControl>
          <FormMessage/>
        </FormItem>
        <div className="h-auto flex flex-wrap flex-start gap-2">
          {selectedSensors.map((sensor, index) => (
            <div id={`sensor${index}`} key={sensor} className="flex items-center space-x-2 border-0 rounded-full border-black border-solid px-2 py-1 bg-green-600">
              <span>
                {sensor}
              </span>
              <Button
                className="bg-gray-900 w-5 h-5 rounded-full text-white flex items-center justify-center"
                type="button"
                onClick={() => {
                  setSelectedSensors((prev) => prev.filter((_, i) => i !== index))
                  document.querySelector(`sensor${index}`)?.remove();
                  form.setValue("sensors", selectedSensors.filter((_, i) => i !== index))
                }}
                variant={"destructive"}
              >
                x
              </Button>
            </div>
          ))}
        </div>
        <AlertDialogFooter>
            <AlertDialogCancel className="text-[#444444]">Cancel</AlertDialogCancel>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="disabled:cursor-not-allowed bg-green-600"
            >
              {form.formState.isSubmitting ? (
                <>
                  Please Wait
                </>
              ): (
                deviceId ? "Save" : "Add"
              )}
            </Button>
            <AlertDialogAction
              className="hidden"
              ref={alertDialogAction}
            ></AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </Form>
  )
}

export default AddDeviceForm;