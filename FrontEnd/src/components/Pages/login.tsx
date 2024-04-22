import { domain, tokenKey } from "@/constants";
import { LoginFormSchema } from "@/zodSchemas";
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

const LoginPage = () => {
  const navigate = useNavigate();
  const [showing, setShowing] = useState(false);
  const password = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues:  {
      email: "",
      password: ""
    }
  });
  const onSubmit = async(values: z.infer<typeof LoginFormSchema>) => {
    const toastId = toast.loading("Logging In...")
    try {
      const { email, password } = values;
      const { data : { data : { accessToken } } } = await axios.post(`${domain}/api/v1/users/login`, {
        usernameOrEmail: email,
        password
      });
      localStorage.setItem(tokenKey, accessToken);
      navigate('/home');
      toast.success("Logged In Successfully", { id: toastId });
    } catch (error : any) {
      toast.error(`Error Logging In : ${error.response.data.message || "Try Again"}`, { id: toastId })
    }
  }
  return (
    <>
    <AuthNavbar/>
    <div className="min-h-[90vh] w-lvw flex justify-between items-center px-20">
      <img src="../../../login.svg" alt="login" className="w-1/3 hidden lg:inline" />
      <Card className="h-auto w-[300px] mx-auto scale-110 bg-[#687a6a] border-0">
        <CardHeader>
          <CardTitle className="text-center text-4xl">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
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
                            if (!showing) {
                              password.current.type = "text";
                            } else {
                              password.current.type = "password";
                            }
                          }
                          setShowing(prev => !prev);
                        }} type="button">{showing ? "Hide" : "Show"}</Button>
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="disabled:cursor-not-allowed bg-green-600 relative left-1/2 -translate-x-1/2"
              >
                {form.formState.isSubmitting ? (
                  <>
                    Logging In...
                  </>
                ): (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <p className="text-center text-sm">
            Don't have an account? <Link to="/signup" className="text-white">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
    </>
  );
};

export default LoginPage;