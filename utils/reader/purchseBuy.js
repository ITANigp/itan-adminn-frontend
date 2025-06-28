// services/api.js
import { api } from "@/utils/auth/readerApi"

export const createPurchase = async (token, bookId, contentType = "ebook") => {
  const response = await api.post(
    "/purchases",
    {
      book_id: bookId,
      content_type: contentType,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
