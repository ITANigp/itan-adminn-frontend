"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/utils/auth/authorApi";

export default function ConfirmEmailContent() {
  const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmation_token = searchParams.get("confirmation_token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState("Confirming...");

  useEffect(() => {
    const confirmEmail = async () => {
      if (!confirmation_token || !email) {
        setStatus("Invalid confirmation link.");
        return;
      }

      try {
        const response = await api.post(
          `${BASE_API_URL}/authors/confirmation/confirm`,
          { confirmation_token, email }
        );
        // Check status code instead of response.ok
        if (response.status >= 200 && response.status < 300) {
          setStatus("Email confirmed! Redirecting...");
          setTimeout(() => router.push("/author/sign_in"), 2000);
        } else {
          // Access the error message from the data object
          const errorMessage =
            response.data?.status?.message ||
            response.data?.message ||
            "Unknown error";

          setStatus(`Email confirmation failed: ${errorMessage}`);
        }
      } catch (error) {
        setStatus("An error occurred. Please try again.");
        console.error("Email confirmation error:", error);
      }
    };

    confirmEmail();
  }, [confirmation_token, email, router, BASE_API_URL]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold mb-4">{status}</h1>
      {status.includes("failed") && (
        <button
          onClick={() => router.push("/sign_in")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Sign In
        </button>
      )}
    </div>
  );
}
