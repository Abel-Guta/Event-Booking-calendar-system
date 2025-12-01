import PasswordResetConfirmationEmail from "@/lib/emails/password-reset-confirmation-email";
import VerificationEmail from "@/lib/emails/verification-email";
import WelcomeEmail from "@/lib/emails/welcome-email";
import { createAdminClient } from "@/utils/supabase/client";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { type, email, password, isPasswordReset, name } =
      await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let data;

    switch (type) {
      case "verification":
        const supabase = createAdminClient();

        const res = await supabase.auth.admin.generateLink({
          type: isPasswordReset ? "recovery" : "signup",
          email,
          password: isPasswordReset ? undefined : password,
        });

        if (res.data?.properties?.email_otp) {
          data = await resend.emails.send({
            from: "Evcal <onboarding@resend.dev>",
            to: email,
            subject: isPasswordReset
              ? "Reset your password"
              : "Verify your email",
            react: VerificationEmail({
              otp: res.data.properties.email_otp,
              isPasswordReset: !!isPasswordReset,
            }),
            replyTo: "onboarding@resend.dev",
          });
        } else {
          return NextResponse.json(
            { error: "Failed to generate OTP" },
            { status: 500 }
          );
        }
        break;

      case "welcome":
        const homeUrl = process.env.NEXT_PUBLIC_BASE_URL;

        data = await resend.emails.send({
          from: "Evcal <onboarding@resend.dev>",
          to: email,
          subject: "Welcome to Evcal!",
          react: WelcomeEmail({
            dashboardUrl: homeUrl,
            userEmail: email,
            userName: name,
          }),
          replyTo: "onboarding@resend.dev",
        });
        break;

      case "password-reset-confirmation":
        const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/signIn`;

        data = await resend.emails.send({
          from: "Evcal <onboarding@resend.dev>",
          to: email,
          subject: "Your password has been reset",
          react: PasswordResetConfirmationEmail({
            userEmail: email,
            loginUrl: loginUrl,
            userName: name,
          }),
          replyTo: "onboarding@resend.dev",
        });

        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
