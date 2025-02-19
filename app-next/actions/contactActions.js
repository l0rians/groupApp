"use server";

import connection from "../lib/database_client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function saveContactMessage(formData) {
  const { name, email, message } = formData;

  console.log("Received contact form data:", { name, email, message });

  try {
    const currentTime = new Date().toISOString();

    const result = await connection("contact_messages").insert({
      name,
      email,
      message,
      created_at: currentTime,
    });

    console.log("Contact message successfully saved:", result);
    return { success: true };
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw new Error("Failed to save contact message.");
  }
}
