import { createClient } from "@/utils/supabase/client";

export async function verifyOtp(email: string, otp: string) {
  const supabase = createClient();

  const ispasswordReset = sessionStorage.getItem("ispasswordReset") === "true";

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: ispasswordReset ? "recovery" : "email",
  });

  if (error) throw new Error();

  return data;
}

export async function login(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error();

  return data;
}

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error();
}

export async function updatePassword(password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error();
}
