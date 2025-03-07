import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export const registerAuthor = async (email, password) => {
    try {
        const response = await api.post("/authors", {
            author: { email, password },
        });

        return response.data;
    } catch (error) {
        console.error("Registration failed:", error.response?.data?.message || error.message || "Unknown error");

        return {
            success: false,
            message: error.response?.data?.message || "Something went wrong. Please try again.",
        };
    }
};

// Sign in an author
export const signInAuthor = async (email, password) => {
    try {
      const response = await api.post("/authors/sign_in", {
        author: { email, password },
      });
      return response.data;
    } catch (error) {
      console.error("Sign-in failed:", error.response?.data || error);
      throw error;
    }
  };

// Sign out an author
export const signOutAuthor = async () => {
    try {
      await api.delete("/authors/sign_out");
      return { success: true };
    } catch (error) {
      console.error("Sign-out failed:", error.response?.data || error);
      throw error;
    }
};

// Sign in an admin
export const signInAdmin = async (email, password) => {
    try {
      const response = await api.post("/admins/sign_in", {
        admin: { email, password },
      });
      return response.data;
    } catch (error) {
      console.error("Admin sign-in failed:", error.response?.data || error);
      throw error;
    }
};

// Sign out an admin
export const signOutAdmin = async () => {
    try {
      await api.delete("/admins/sign_out");
      return { success: true };
    } catch (error) {
      console.error("Admin sign-out failed:", error.response?.data || error);
      throw error;
    }
};