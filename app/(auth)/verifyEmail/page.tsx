import VerifyEmailForm from "@/components/verifyEmailForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Evcal auth Verify Email",
  description: "Evcal Authentication Verify Email Page",
};

const VerifyEmail = () => {
  return <VerifyEmailForm />;
};

export default VerifyEmail;
