import PasswordResetForm from "@/components/passwordResetForm";
import SignInForm from "@/components/signInForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Evcal auth Sign In",
  description: "Eccal Authentication Sign In Page",
};

const PasswordReset = () => {
  return <PasswordResetForm />;
};

export default PasswordReset;
