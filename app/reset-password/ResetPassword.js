"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/utils/auth/authorApi";
import Link from "next/link";
import Image from "next/image";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reset_password_token = searchParams.get("reset_password_token");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/authors/password", {
        author: {
          reset_password_token,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      setMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => router.push("/author/sign_in"), 2000);
    } catch (err) {
      setError(err.response?.data?.errors || ["An error occurred."]);
    }
  };

  //   <div className="max-w-md mx-auto mt-16 p-4 border rounded-xl">
  //     <h1 className="text-xl font-bold mb-4">Reset Your Password</h1>
  //     <form onSubmit={handleSubmit}>
  //       <input
  //         type="password"
  //         className="w-full mb-3 p-2 border rounded"
  //         placeholder="New password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //         required
  //       />
  //       <input
  //         type="password"
  //         className="w-full mb-3 p-2 border rounded"
  //         placeholder="Confirm new password"
  //         value={passwordConfirmation}
  //         onChange={(e) => setPasswordConfirmation(e.target.value)}
  //         required
  //       />
  //       <button className="bg-green-600 text-white px-4 py-2 rounded">
  //         Reset Password
  //       </button>
  //     </form>
  //     {message && <p className="mt-4 text-green-600">{message}</p>}
  //     {error.length > 0 && (
  //       <ul className="mt-4 text-red-600 list-disc pl-5">
  //         {error.map((e, i) => (
  //           <li key={i}>{e}</li>
  //         ))}
  //       </ul>
  //     )}
  //   </div>
  // );
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
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-md text-sm"
        />
        <input
          type="password"
                 
                  placeholder="Confirm new password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-md text-sm"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#E50913] text-white py-3 rounded-md hover:bg-[#e50914da] disabled:opacity-50"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
