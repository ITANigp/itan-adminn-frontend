import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
});

// Sign in an admin
export const signInAdmin = async (email, password) => {
  try {
    const response = await api.post("/admins/sign_in", {
      admin: { email, password },
    });
    return response.data;
  } catch (error) {
    console.error("Admin sign-in failed:", error.response?.data);
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

export const getAllBooks = async () => {
  try {
    const response = await api.get("/admin/books");
    return response.data.data;
  } catch (err) {
    console.log("Error fetching all Books: ", err);
  }
};


export const getAllAuthors = async () => {
  try {
    const response = await api.get("admin/authors");
    return response.data.data;
  } catch (err) {
    console.log("Error fetching all Authors: ", err);
  }
};
export const getAllReaders = async () => {
  try {
    const response = await api.get("admin/readers");
    return response.data.data;
  } catch (err) {
    console.log("Error fetching all Readers: ", err);
  }
};