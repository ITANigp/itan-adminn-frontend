export const accessBookContent = async (readingToken, bookId) => {
  const response = await API.get(`/books/${bookId}/content`, {
    headers: {
      Authorization: `Bearer ${readingToken}`,
    },
  });
  return response.data;
};
