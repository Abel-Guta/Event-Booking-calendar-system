import SignUpForm from "@/components/SignUpForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Evcal auth Sign Up",
  description: "Eccal Authentication Sign Up Page",
};

const SignUp = () => {
  return <SignUpForm />;
};

export default SignUp;
