"use server";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";


export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  //should align with salesforce password system
  if (password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }

  // Fetch from saleforce API
  // Save the JWT token in the browser cookie. This is the test
  const token = await createSession("user_id_123", "account_id_456");
  if(!token){
    return { ok: false, message: "Failed to create session." };
  }
  // console.log("Session token:", token);
  return { ok: true, message: "Logged in successfully." };
}


export async function logout(){
    await deleteSession();
    redirect("/login");
}