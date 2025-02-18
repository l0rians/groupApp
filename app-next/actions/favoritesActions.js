"use server";

import connection from "../lib/database_client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function addToFavorites(movieId) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      console.error("User ID not found in cookies");
      return { success: false, message: "User not authenticated." };
    }

    console.log("Adding movie to favorites:", { userId, movieId });

    const movieExists = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=8ec0629bf685d1704229f499278c23a5`
    );
    if (!movieExists.ok) {
      console.error("Movie does not exist in API:", movieId);
      return { success: false, message: "Movie does not exist." };
    }

    const existing = await connection("favorites")
      .where({ user_id: userId, movie_id: movieId })
      .first();

    if (existing) {
      console.log("Movie already in favorites.");
      return { success: false, message: "Movie already in favorites." };
    }

    await connection("favorites").insert({
      user_id: userId,
      movie_id: movieId,
    });

    console.log("Movie added to favorites successfully.");
    return { success: true, message: "Movie added to favorites." };
  } catch (error) {
    console.error("Error adding movie to favorites:", error);
    return {
      success: false,
      message: "Failed to add movie to favorites.",
      error,
    };
  }
}

export async function removeFromFavorites(movieId) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      console.error("User ID not found in cookies");
      return { success: false, message: "User not authenticated." };
    }

    console.log("Removing movie from favorites:", { userId, movieId });

    const result = await connection("favorites")
      .where({ user_id: userId, movie_id: movieId })
      .delete();

    if (result === 0) {
      console.warn("No favorite found to remove for:", { userId, movieId });
      return { success: false, message: "Movie not found in favorites." };
    }

    console.log("Movie removed from favorites successfully.");
    return { success: true, message: "Movie removed from favorites." };
  } catch (error) {
    console.error("Error removing movie from favorites:", error);
    return {
      success: false,
      message: "Failed to remove movie from favorites.",
      error,
    };
  }
}

export async function getFavorites() {
  try {
    console.log("Step 1: Extracting userId from cookies...");

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      console.error("User ID not found in cookies");
      return { success: false, message: "User not authenticated." };
    }

    console.log("Fetching favorites for user:", userId);

    console.log("Step 2: Fetching favorites from database...");
    const favorites = await connection("favorites")
      .where({ user_id: userId })
      .select("movie_id");

    console.log("Favorites fetched from database:", favorites);

    if (favorites.length === 0) {
      console.log("No favorites found for user:", userId);
      return {
        success: true,
        message: "No favorites found.",
        favorites: [],
      };
    }

    console.log("Step 3: Fetching movie details from API...");
    const movieIds = favorites.map((fav) => fav.movie_id);
    const movies = await Promise.all(
      movieIds.map(async (id) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=8ec0629bf685d1704229f499278c23a5`
          );
          console.log("API Response for movie ID", id, ":", response.status);

          if (response.ok) {
            return await response.json();
          } else {
            console.warn("Failed to fetch movie from API:", id);
            return null;
          }
        } catch (error) {
          console.error("Error fetching movie from API:", id, error);
          return null;
        }
      })
    );

    console.log("Step 4: Filtering valid movies...");
    const validMovies = movies.filter((movie) => movie !== null);
    console.log("Valid movies after filtering:", validMovies);

    console.log("Favorites fetched successfully:", validMovies);
    return { success: true, favorites: validMovies };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return { success: false, message: "Failed to fetch favorites.", error };
  }
}
