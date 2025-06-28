export const refreshReadingToken = async (token, purchaseId) => {
  const response = await API.post(
    "/purchases/refresh_reading_token",
    {
      purchase_id: purchaseId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
