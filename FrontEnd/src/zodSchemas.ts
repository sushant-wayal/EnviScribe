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

export const LoginFormSchema = z.object({
  email: z.string().min(1,{
    message: "Email is Required"
  }).email({
    message: "Invalid Email"
  }),
  password: z.string().min(1, {
    message: "Password is Required"
  }),
})

export const SignUpFormSchema = z.object({
  email: z.string().min(1,{
    message: "Email is Required"
  }).email({
    message: "Invalid Email"
  }),
  password: z.string().min(1, {
    message: "Password is Required"
  }),
  institutionKey: z.string().min(1, {
    message: "Institution Key is Required"
  })
})

export const InstituteRegistrationFormSchema = z.object({
  name: z.string().min(1, {
    message: "Institution Name is required"
  }),
  email: z.string().min(1, {
    message: "Email is Required"
  }).email({
    message: "Invalid Email"
  }),
  key: z.string().min(1, {
    message: "Institution Key is Required"
  })
})