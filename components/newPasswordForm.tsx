"use client";

import { email, set, z } from "zod";
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
  authFormSchema,
  newPasswordFormSchema,
} from "@/lib/validations/validation";

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
import { useEffect, useState } from "react";
import { login, updatePassword } from "@/lib/helpers/auth-helpers";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const NewPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/passwordReset");
        return;
      }
      setEmail(data.session.user.email!);
    }
    checkSession();
  }, [router]);

  const form = useForm<z.infer<typeof newPasswordFormSchema>>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof newPasswordFormSchema>) {
    setLoading(true);

    try {
      await updatePassword(values.password);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("Users")
        .select("name")
        .eq("email", email)
        .single();
      if (error) {
        throw new Error(error.message);
      }

      await fetch("/api/resend", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "password-reset-confirmation",
          email,
          name: data.name,
        }),
      });

      supabase.auth.signOut();
      toast.success("Password updated successfully!");
      router.push("/signIn");
      sessionStorage.removeItem("isPasswordReset");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
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
            New Password
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your new password below to secure your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* **Email Field** */}

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
                  </FormItem>
                )}
              />

              {/* **Submit Button** - Primary action button */}
              <Button
                type="submit"
                className="w-full h-10 tracking-wide font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                {loading ? "Updating Password..." : "Set New Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPasswordForm;
