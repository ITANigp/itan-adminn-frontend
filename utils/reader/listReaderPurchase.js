export const listUserPurchases = async (token) => {
  const response = await API.get("/purchases", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
