"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { api } from "@/utils/auth/authorApi";
import { getTwoFactorStatus } from "@/utils/twoFactorAuth";

const Profile = () => {
  const router = useRouter();
  const [twoFactorStatus, setTwoFactorStatus] = useState(null);

  // Fetch 2FA status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getTwoFactorStatus();
        console.log("2FA Status:", status);
        setTwoFactorStatus(status);
      } catch (err) {
        console.error("Failed to fetch 2FA status:", err);
      }
    };

    // fetchStatus();
  }, []);

  const isEmailEnabled =
    twoFactorStatus?.preferred_method === "email" &&
    twoFactorStatus?.two_factor_enabled === true;

  const isLoading = twoFactorStatus === null;

  const handleEmailToggle = async (val) => {
    const author = {
      two_factor_enabled: val,
      preferred_2fa_method: val ? "email" : null,
    };

    try {
      const response = await api.patch("/authors/profile", { author });
      console.log("2FA updated:", response);
      setTwoFactorStatus((prev) => ({
        ...prev,
        two_factor_enabled: author.two_factor_enabled,
        preferred_method: author.preferred_2fa_method,
      }));
    } catch (err) {
      console.error("2FA update error:", err);
    }
  };

  return (
    <div>
      <section className="text-center mx-auto">
        <div className="flex justify-between">
          <div className="hidden lg:block"/>
          <div className="lg:hidden">
            <FontAwesomeIcon
              icon={faChevronLeft}
              onClick={() => router.back()}
              className="ml-3 p-2 py-1 rounded-md cursor-pointer hover:bg-gray-400"
            />
          </div>
          <h2 className="font-bold text-xl">Privacy and Security</h2>
          <p className="mr-7" />
        </div>
      </section>

      <section>
        <div className="relative flex mx-auto flex-col items-center max-w-lg bg-white shadow-md rounded-lg mt-16 px-2 text-sm">
          <h3 className="absolute left-0 -top-6 text-lg mb-2">
            Multi-factor Authentication
          </h3>

          <div className="flex justify-between items-center w-full mb-2">
            <div>
              <p className="text-lg text-gray-800">Email</p>
              <p className="pt-1 text-xs text-gray-500">
                Secure sign-in with email verification.
              </p>
            </div>
            <div className="cursor-pointer">
              <Switch
                checked={isEmailEnabled}
                // onCheckedChange={handleEmailToggle}
                disabled={isLoading}
                className={cn(
                  isEmailEnabled && "bg-green-500",
                  "data-[state=checked]:bg-green-500 my-2"
                )}
              />
              <p className="text-xs text-gray-500">
                {isEmailEnabled ? "Disabled" : "Enabled"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
