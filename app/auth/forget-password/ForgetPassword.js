"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { api } from "@/utils/auth/authorApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/authors/password", {
        author: { email },
      });
      setMessage("If the email exists, reset instructions have been sent.");
    } catch (err) {
      setMessage("If the email exists, reset instructions have been sent.");
    }
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
          href="/author/sign_in"
          className="bg-[#E50913] text-white px-2 py-1 rounded-md hover:bg-[#e50914da] disabled:opacity-50"
        >
          Login to account
        </Link>
      </header>
      {/* Left column: OTP box */}
      <div className="w-full max-w-[400px] p-8 border rounded shadow-lg space-y-6 mr-6 mt-20">
        <h2 className="text-lg font-medium text-gray-800 text-left">
          Forget Password?
        </h2>

        <input
          type="text"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-md text-sm"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#E50913] text-white py-3 rounded-md hover:bg-[#e50914da] disabled:opacity-50"
        >
          Reset Password
        </button>

        <Link href="/author/sign_in" className="text-sm text-[#091be5] disabled:opacity-50 rounded-md">
          Remember your password?
        </Link>
      </div>
    </div>
  );
}
