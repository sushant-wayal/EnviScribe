import { z } from "zod"

export const AddDeviceFormSchema = z.object({
  deviceName: z.string().min(1,
    { message: "Device name is Required" }
  ),
  longitude: z.number().min(-180, {
    message: "Longitude must be between -180 and 180"
  }).max(180, {
    message: "Longitude must be between -180 and 180"
  }),
  latitude: z.number().min(-90, {
    message: "Latitude must be between -90 and 90"
  }).max(90, {
    message: "Latitude must be between -90 and 90"
  }),
  sensors: z.array(z.object({
    sensorName: z.string().min(1, {
      message: "Sensor name is Required"
    }),
  }))
})