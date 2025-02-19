"use server";
import connection from "../lib/database_client";
import { cookies } from "next/headers";
export async function createRoom(videoUrl) {
  try {
    const [room] = await connection("room")
      .insert({
        video_url: videoUrl,
      })
      .returning("*");
    return room;
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error("Failed to create room");
  }
}

export async function getRoom(roomId) {
  try {
    const room = await connection("room").where({ id: roomId }).first();
    return room;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw new Error("Failed to fetch room");
  }
}

export async function updateRoom(room) {
  try {
    await connection("room")
      .where({ id: room.id })
      .update({
        ...(room.cursor && { cursor: room.cursor }),
        ...(room.video_state && { video_state: room.video_state }),
      });
  } catch (error) {
    console.error("Error updating room:", error);
    throw new Error("Failed to update room");
  }
}
