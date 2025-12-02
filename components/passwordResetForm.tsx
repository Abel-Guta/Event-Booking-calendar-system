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
import { authFormSchema, resetFormSchema } from "@/lib/validations/validation";

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
import ResetPasswordEmail from "@/lib/emails/reset-password-email";

const PasswordResetForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof resetFormSchema>>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetFormSchema>) {
    setLoading(true);

    try {
      sessionStorage.setItem("verification-email", values.email);
      sessionStorage.setItem("isPasswordReset", "true");
      await fetch("api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "verification",
          email: values.email,
          isPasswordReset: true,
        }),
      });

      router.push("/verifyEmail");
      toast.success("Password reset code sent to your email!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email."
      );
      toast.error(error);
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter yor email to recieve a code to reset your password.
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

              <Button
                type="submit"
                className="w-full h-10 tracking-wide font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          </Form>

          {/* **Sign Up Link** - Added for better UX */}
          <div className="mt-6 text-center text-sm">
            Remember your password?{" "}
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

export default PasswordResetForm;
