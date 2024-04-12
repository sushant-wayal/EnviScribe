import { z } from "zod"

export const AddDeviceFormSchema = z.object({
  deviceName: z.string().min(1,
    { message: "Device name is Required" }
  ),
  longitude: z.string()
  .refine(value => !isNaN(parseFloat(value)), {
    message: "Longitude must be a number"
  }).refine(value => parseFloat(value) >= -180 && parseFloat(value) <= 180, {
    message: "Longitude must be between -180 and 180"
  }),
  latitude: z.string().refine(value => !isNaN(parseFloat(value)), {
    message: "Latitude must be a number"
  }).refine(value => parseFloat(value) >= -90 && parseFloat(value) <= 90, {
    message: "Latitude must be between -90 and 90"
  }),
  sensors: z.array(z.string().min(1, {
      message: "Sensor name is Required"
    }),
  )
})