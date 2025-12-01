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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { verifyFormSchema } from "@/lib/validations/validation";

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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp } from "@/lib/helpers/auth-helpers";

const VerifyEmailForm = () => {
  const [email, setEmail] = useState<string>();
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verification-email");

    if (!storedEmail) {
      router.push("/SignUp");
    }

    setEmail(storedEmail!);

    const passwordResetFlag = sessionStorage.getItem("isPasswordReset");

    setIsPasswordReset(passwordResetFlag === "true");
  }, [router]);

  const form = useForm<z.infer<typeof verifyFormSchema>>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof verifyFormSchema>) {
    setLoading(true);
    try {
      await verifyOtp(values.email, values.code);
      sessionStorage.removeItem("verification-email");

      if (isPasswordReset) {
        router.push("/newPassword");
      } else {
        sessionStorage.removeItem("isPasswordReset");

        await fetch("/api/resend", {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "welcome",
            email: values.email,
            name: sessionStorage.getItem("userName") || "User",
          }),
        });
        // delete usename from session storage and newpassword page is protected by middleware  continue from here

        router.push("/");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    // **Outer Container** - Using a dark, full-height background for visual appeal
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300 p-4">
      {/* **Card Component** - The main visual container */}

      <Card className="w-full max-w-sm shadow-2xl border-2 border-primary/20 dark:border-primary/50">
        {/* **Card Header** - Contains the title and description */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">
            {isPasswordReset
              ? "Reset Password Verification"
              : "Email Verification"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {isPasswordReset
              ? "Please enter the verification code sent to your email to reset your password."
              : "Please enter the verification code sent to your email to verify your account."}
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
                        value={field.value}
                        onChange={field.onChange}
                        defaultValue={email}
                        readOnly
                        className="h-10 transition duration-300 focus-visible:border-amber-500 focus-visible:ring-amber-500/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* **Password Field** */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup className=" w-full flex space-x-2  ">
                          <InputOTPSlot
                            index={0}
                            className="rounded-sm size-9"
                          />
                          <InputOTPSlot
                            index={1}
                            className="rounded-sm size-9  "
                          />
                          <InputOTPSlot
                            index={2}
                            className="rounded-sm size-9  "
                          />
                          <InputOTPSlot
                            index={3}
                            className="rounded-sm size-9  "
                          />
                          <InputOTPSlot
                            index={4}
                            className="rounded-sm size-9"
                          />
                          <InputOTPSlot
                            index={5}
                            className="rounded-sm size-9"
                          />
                          <InputOTPSlot
                            index={6}
                            className="rounded-sm size-9"
                          />
                          <InputOTPSlot
                            index={6}
                            className="rounded-sm size-9"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your phone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* **Submit Button** - Primary action button */}
              <Button
                type="submit"
                className="w-full h-10 tracking-wide font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                {isPasswordReset ? "Verify & Reset Password" : "Verify Email"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailForm;
