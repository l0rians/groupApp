"use server";

import connection from "../lib/database_client.js";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function getUserProfile(userId) {
  try {
    const user = await connection("user")
      .select(
        "id",
        "username",
        "avatar_url",
        connection.raw(`TO_CHAR(dob, 'YYYY-MM-DD') AS dob`)
      )
      .where({ id: userId })
      .first();

    if (!user) {
      throw new Error("User not found.");
    }

    console.log("Fetched user profile from DB:", user);

    return {
      username: user.username,
      avatarUrl: user.avatar_url,
      dob: user.dob || null,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile.");
  }
}

export async function updateProfile(userId, dob, avatarUrl) {
  try {
    console.log("Updating profile with:", { userId, dob, avatarUrl });

    const formattedDob = dob ? dob.split("T")[0] : null;

    const updateData = {
      updated_at: new Date(),
    };

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }

    if (formattedDob) {
      updateData.dob = formattedDob;
    }

    await connection("user").where({ id: userId }).update(updateData);

    console.log("Profile updated successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile.");
  }
}
