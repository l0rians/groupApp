"use server";

import connection from "../lib/database_client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function saveReview(formData) {
  const rating = formData.get("rating");
  const title = formData.get("title");
  const review = formData.get("review");
  console.log("Received data in saveReview:", { rating, title, review });
  try {
    await connection("reviews").insert({
      rating: parseInt(rating, 10),
      title,
      review,
    });
    console.log("Review successfully saved.");
    return { success: true };
  } catch (error) {
    console.error("Error saving review to database:", error.message);
    throw new Error("Failed to save review.");
  }
}
