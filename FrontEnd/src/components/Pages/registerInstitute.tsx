import { domain } from "@/constants";
import { InstituteRegistrationFormSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "@mui/material";
import AuthNavbar from "../Components/AuthNavbar";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const InstitutionregistrationPage = () => {
  const navigate = useNavigate();
  const institutionKey = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof InstituteRegistrationFormSchema>>({
    resolver: zodResolver(InstituteRegistrationFormSchema),
    defaultValues:  {
      name: "",
      email: "",
      key: uuidv4(),
    }
  });
  const onSubmit = async(values: z.infer<typeof InstituteRegistrationFormSchema>) => {
    const toastId = toast.loading("Registring Institute...")
    try {
      const { name, email, key } = values;
      await axios.post(`${domain}/api/v1/institutions/register`, {
        name,
        email,
        key
      });
      navigate('/signup');
      toast.success("Institute Registered Successfully", { id: toastId });
    } catch (error : any) {
      toast.error(`Error Registering Institute : ${error.response.data.message || "Try Again"}`, { id: toastId })
    }
  }
  return (
    <>
    <AuthNavbar/>
    <div className="min-h-[90vh] w-lvw flex justify-between items-center px-20">
      <img src="../../../login.svg" alt="login" className="w-1/3 hidden lg:inline" />
      <Card className="h-auto w-[400px] mx-auto scale-110 bg-[#687a6a] border-0 relative">
        <CardHeader className="pb-0">
          <CardTitle className="text-center text-4xl">Register Institute</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="flex flex-col gap-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-between gap-2">
                          <Input
                            type="text"
                            placeholder="Institution Name"
                            {...field}
                            className="bg-white placeholder:text-[#444444]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="p-0 m-0">
                      <FormLabel>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="bg-white placeholder:text-[#444444]"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Institution Key
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-between gap-2">
                          <Input
                            type="text"
                            placeholder="Institution Key"
                            {...field}
                            className="bg-white placeholder:text-[#444444]"
                            ref={institutionKey}
                            readOnly
                          />
                          <Button onClick={() => {
                            institutionKey.current?.select();
                            institutionKey.current?.setSelectionRange(0, form.getValues().key.length);
                            window.navigator.clipboard.writeText(form.getValues().key);
                          }} type="button">Copy</Button>
                        </div>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="disabled:cursor-not-allowed bg-green-600 relative left-1/2 -translate-x-1/2"
              >
                {form.formState.isSubmitting ? (
                  <>
                    Registering Institute...
                  </>
                ): (
                  "Register Institute"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <p className="text-center text-sm">
            Already have an Institute Key? <Link to="/signup" className="text-white">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
    </>
  );
};

export default InstitutionregistrationPage;