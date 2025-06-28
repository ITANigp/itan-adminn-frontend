import { api } from "@/utils/auth/readerApi";
import { tokenManager } from "./tokenManager";

export async function handlePaymentCallback(
  showSuccess,
  showError,
  navigateToReader,
  showProcessing
) {
  const urlParams = new URLSearchParams(window.location.search);
  const reference =
    urlParams.get("reference") ||
    localStorage.getItem("current_payment_reference");

  if (!reference) {
    showError("Payment reference not found");
    return;
  }

  try {
    const response = await checkPaymentStatus(reference);

    if (response.purchase_status === "completed") {
      const { reading_token, book_id, book_title, purchase_id } = response;
      tokenManager.storeToken(book_id, reading_token, purchase_id);
      showSuccess(`Successfully purchased "${book_title}"`);
      setTimeout(() => navigateToReader(book_id), 2000);
    } else if (response.purchase_status === "pending") {
      showProcessing("Payment is being processed...");
      startPolling(reference, showSuccess, showError, navigateToReader);
    } else {
      showError("Payment was not successful");
    }
  } catch (err) {
    console.error("Error checking payment:", err);
    showError("Error verifying payment");
  }
}

export async function checkPaymentStatus(reference) {
  const response = await api.get(
    `/purchases/check_status?reference=${reference}`
  );
  return response.data.data;
}

export function startPolling(
  reference,
  showSuccess,
  showError,
  navigateToReader
) {
  let attempts = 0;
  const maxAttempts = 5;

  const pollInterval = setInterval(async () => {
    attempts++;

    try {
      const response = await checkPaymentStatus(reference);
      if (response.purchase_status === "completed") {
        clearInterval(pollInterval);
        handlePaymentCallback(showSuccess, showError, navigateToReader);
      } else if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        showError("Payment verification timeout. Please check your account.");
      }
    } catch (error) {
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        showError("Payment verification failed");
      }
    }
  }, 5000);
}
