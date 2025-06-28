import { api } from "@/utils/auth/authorApi";

// Get 2FA status
export const getTwoFactorStatus = async () => {
  const { data } = await api.get("/authors/two_factor/status");
  return data.data;
};

// Enable Email 2FA
export const enableEmail2FA = async () => {
  const { data } = await api.post("/authors/two_factor/enable_email");
  return data;
};

// Set up SMS (register phone)
export const setupSms2FA = async (phoneNumber) => {
  const { data } = await api.post("/authors/two_factor/setup_sms", {
    phone_number: phoneNumber,
  });
  console.log("Phone setup Successful: ", data);
  return data;
};

// Verify phone (only needed once)
export const verify2FA = async (code) => {
  const { data } = await api.post("/authors/verify", {
    verification_code: code,
  });
  return data;
};
export const resendCode = async () => {
  const { data } = await api.post("/authors/resend_verification");
  return data;
};

//Disable 2FA
export const disable2FA = async () => {
  const { data } = await api.delete("/authors/two_factor/disable");
  return data;
};
