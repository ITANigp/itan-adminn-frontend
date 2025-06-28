export const checkPaymentStatus = async (token, reference) => {
  const response = await API.get(
    `/purchases/check_status?reference=${reference}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
