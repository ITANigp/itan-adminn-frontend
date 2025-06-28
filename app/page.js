"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { signInAdmin } from "@/utils/auth/adminApi";

export default function AdminAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error before making a new request

    try {
      await signInAdmin(email, password);
      router.push("/admin/dashboard");
      toast.success("logged in successfully!")
    } catch (err) {
      if (!err.response) {
        toast.error("Cannot connect to the server. Please try again later.");
      } else {
        toast.error(
          err.response?.data ||
            "Sign-in failed. Please check your credentials."
            
        );
        console.log("admin log in err: ", err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // **Clear error message after 2 seconds**
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Reset error state
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timeout on re-render
    }
  }, [error]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Admin Sign In</h2>

      {/* Show error message only when there is an error */}
      {error && <p className="text-red-500 text-sm my-2">{error}</p>}

      <form onSubmit={handleSignIn} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
