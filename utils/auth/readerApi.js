import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Register an author
export const registerReader = async (
  email,
  password,
  password_confirmation,
  first_name,
  last_name
) => {
  try {
    const response = await api.post("/readers", {
      reader: {
        email,
        password,
        password_confirmation,
        first_name,
        last_name,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data?.message || error.message || "Unknown error"
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  }
};



// Sign in an author
export const signInReader = async (email, password) => {
  try {
    const response = await api.post("/readers/sign_in", {
      reader: { email, password, "rememberable_options": true },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Sign out an author
export const signOutAuthor = async () => {
  try {
    await api.delete("/authors/sign_out");
    localStorage.removeItem("authorInfo");

    const router = useRouter();
    router.push("/author/sign_in");

    return { success: true };
  } catch (error) {
    console.error("Sign-out failed:", error.response?.data || error);
  }
};

