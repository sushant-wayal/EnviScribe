import { domain, tokenKey } from "@/constants";
import { SignUpFormSchema } from "@/zodSchemas";
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
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showingPassword, setShowingPassword] = useState(false);
  const [showingInstitutionKey, setShowingInstitutionKey] = useState(false);
  const password = useRef<HTMLInputElement>(null);
  const institutionKey = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues:  {
      email: "",
      password: "",
      institutionKey: ""
    }
  });
  const onSubmit = async(values: z.infer<typeof SignUpFormSchema>) => {
    const toastId = toast.loading("Signing Up...")
    try {
      const { email, password, institutionKey } = values;
      const { data : { data : { accessToken } } } = await axios.post(`${domain}/api/v1/users/register`, {
        email,
        password,
        institutionKey,
      });
      localStorage.setItem(tokenKey, accessToken);
      navigate('/home');
      toast.success("Signed Up Successfully", { id: toastId });
    } catch (error : any) {
      toast.error(`Error Signing Up : ${error.response.data.error || "Try Again"}`, { id: toastId })
    }
  }
  return (
    <>
    <AuthNavbar/>
    <div className="min-h-[90vh] w-lvw flex justify-between items-center px-20">
      <img src="../../../login.svg" alt="login" className="w-1/3 hidden lg:inline" />
      <Card className="h-auto w-[300px] mx-auto scale-110 bg-[#687a6a] border-0 relative">
        <CardHeader className="pb-0">
          <CardTitle className="text-center text-4xl">Sign Up</CardTitle>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-between gap-2">
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                            className="bg-white placeholder:text-[#444444]"
                            ref={password}
                          />
                          <Button className="w-16" onClick={() => {
                            if (password.current) {
                              if (!showingPassword) {
                                password.current.type = "text";
                              } else {
                                password.current.type = "password";
                              }
                            }
                            setShowingPassword(prev => !prev);
                          }} type="button">{showingPassword ? "Hide" : "Show"}</Button>
                        </div>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="institutionKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Institution Key
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-between gap-2">
                          <Input
                            type="password"
                            placeholder="Institution Key"
                            {...field}
                            className="bg-white placeholder:text-[#444444]"
                            ref={institutionKey}
                          />
                          <Button className="w-16" onClick={() => {
                            if (institutionKey.current) {
                              if (!showingInstitutionKey) {
                                institutionKey.current.type = "text";
                              } else {
                                institutionKey.current.type = "password";
                              }
                            }
                            setShowingInstitutionKey(prev => !prev);
                          }} type="button">{showingInstitutionKey ? "Hide" : "Show"}</Button>
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
                    Signing Up...
                  </>
                ): (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm">
            Already have an account? <Link to="/login" className="text-white">Log In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
    </>
  );
};

export default SignUpPage;