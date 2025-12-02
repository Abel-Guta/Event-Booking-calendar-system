"use client";

import { set, z } from "zod";
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
import { signupauthFormSchema } from "@/lib/validations/validation";

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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signupauthFormSchema>>({
    resolver: zodResolver(signupauthFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupauthFormSchema>) {
    setLoading(true);
    try {
      sessionStorage.setItem("verification-email", values.email);
      sessionStorage.setItem("userName", values.name);
      const res = await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verification",
          email: values.email,
          name: values.name,
          password: values.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      toast.success("Verification code sent to your email!");
      router.push("/verifyEmail");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }

  //   imported shad form
  // next for tommorow

  return (
    // **Outer Container** - Using a dark, full-height background for visual appeal
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300 p-4">
      {/* **Card Component** - The main visual container */}

      <Card className="w-full max-w-sm shadow-2xl border-2 border-primary/20 dark:border-primary/50">
        {/* **Card Header** - Contains the title and description */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            Welcome! 👋
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Create an account to manage your events and calendar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name field */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        type="text"
                        {...field}
                        className="h-10 transition duration-300 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

                    {/* **Forgot Password Link** */}
                    <div className="text-right">
                      <Link
                        href="/forgot-password" // Placeholder link
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
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          {/* **Sign Up Link** - Added for better UX */}
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href={"/signIn"}
              // Placeholder link
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
