"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authFormSchema } from "@/lib/validations/validation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/helpers/auth-helpers";
import { toast } from "sonner";

const SignInForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof authFormSchema>) {
    setLoading(true);

    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message ? err.message : "Error Signing In");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300 p-4">
      {/* **Card Component** - The main visual container */}

      <Card className="w-full max-w-sm shadow-2xl border-2 border-primary/20 dark:border-primary/50">
        {/* **Card Header** - Contains the title and description */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            Welcome Back! 👋
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to manage your events and calendar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* **Email Field** */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                        className="h-10 transition duration-300 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* **Password Field** */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-10 transition duration-300 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />

                    {/* **Forgot Password Link** - Added for better UX */}
                    <div className="text-right">
                      <Link
                        href="/passwordReset"
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              {/* **Submit Button** - Primary action button */}
              <Button
                type="submit"
                className="w-full h-10 tracking-wide font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {/* **Sign Up Link** - Added for better UX */}
          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              href={"/signUp"}
              // Placeholder link
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInForm;
