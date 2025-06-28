"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  verify2FA,
  getTwoFactorStatus,
  resendCode,
} from "@/utils/twoFactorAuth";
import Link from "next/link";
import Image from "next/image";

const TIMER_KEY = "resend_timer_expiry";

const TwoFactorSettings = () => {
  const [status, setStatus] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0); // seconds

  const router = useRouter();

  // Load 2FA status and check for existing timer
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getTwoFactorStatus();
        setStatus(res);
      } catch (error) {
        console.error("Failed to fetch 2FA status", error);
      }
    };

    fetchStatus();

    const expiry = localStorage.getItem(TIMER_KEY);
    if (expiry) {
      const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
      if (remaining > 0) setResendTimer(remaining);
    }
  }, []);

  // Countdown interval for resend timer
  useEffect(() => {
    if (resendTimer === 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem(TIMER_KEY);
          clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify2FA = async () => {
    if (!code.trim()) {
      setMessage("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data2FA = await verify2FA(code);
      console.log("2FA Verification Result:", data2FA);
      setMessage("Verification successful.");

      if (data2FA.status.code === 200) {
        // ✅ Clear resend timer
        localStorage.removeItem(TIMER_KEY);
        setResendTimer(0);
        // localStorage.setItem("authorInfo", JSON.stringify(author.data));
        console.log("2fa data: ", data2FA.data);
        localStorage.setItem("authorInfo", JSON.stringify(data2FA.data));
        router.push(`/dashboard/author/${data2FA.data.id}`);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setMessage("Verification failed. Please check the code and try again.");
    } finally {
      setLoading(false);
      setCode("");
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      await resendCode();
      setMessage("Verification code resent.");
      const expiry = Date.now() + 2 * 60 * 1000;
      localStorage.setItem(TIMER_KEY, expiry.toString());
      setResendTimer(120);
    } catch (err) {
      console.log("Resend code error: ", err);
      setMessage("Failed to resend code. Please try again later.");
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="flex flex-col min-h-screen w-full px-3">
      <header className="flex justify-between mt-3 mx-3">
        <Link href="#">
          <Image
            width={20}
            height={15}
            src="/images/logo.png"
            alt="Company Logo"
            className="w-10 h-6 cursor-pointer"
          />
        </Link>
          <Link
            href="/author/sign_up"
            className="bg-[#E50913] text-white px-2 py-1 rounded-md hover:bg-[#e50914da] disabled:opacity-50"
          >
            Create account
          </Link>
      </header>
      {/* Left column: OTP box */}
      <div className="w-full max-w-[400px] p-8 border rounded shadow-lg space-y-6 mr-6 mt-20">
        <h2 className="text-lg font-medium text-gray-800 text-left">
          Please enter the OTP sent to your email address or phone number
        </h2>

        <input
          type="text"
          placeholder="One time password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-md text-sm"
        />

        <button
          onClick={handleVerify2FA}
          disabled={loading}
          className="w-full bg-[#E50913] text-white py-3 rounded-md hover:bg-[#e50914da] disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>

        <button
          onClick={handleResendCode}
          disabled={resendTimer > 0}
          className={`text-sm ${
            resendTimer > 0 ? "text-gray-400" : "text-[#4a3aff]"
          } disabled:opacity-50`}
        >
          {resendTimer > 0
            ? `Resend in ${formatTime(resendTimer)}`
            : "Resend OTP"}
        </button>

        {message && (
          <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>
        )}
      </div>

      {/* Right column: blank space or banner */}
      <div className="flex-1 hidden lg:block bg-white" />
    </div>
  );
};

export default TwoFactorSettings;
