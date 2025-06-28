"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import toast from "react-hot-toast";

import LogoutModal from "@/components/LogoutModal";
// import { getAuthorProfile } from "@/utils/auth/authorApi";
import { signOutAdmin } from "@/utils/auth/adminApi";

const Layout = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState({});
  const pathname = usePathname();
  const router = useRouter();

  const isProfilePage = pathname.endsWith("/settings");
  const isPrivacyPage = pathname.endsWith("/security");
  const isNotificationPage = pathname.endsWith("/notification");

  // const fetchProfile = async () => {
  //   try {
  //     const { data } = await getAuthorProfile();
  //     setProfile(data);
  //     console.log("Fetched Profile Data: ", data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchProfile();
  // }, []);

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (err) {
      toast.error("Sign-out failed. Please try again.");
    }
  };

  return (
    <div className="mx-2 bg-gray-100 lg:bg-white ">
      <div className="lg:flex lg:space-x-6 p-4 bg-gray-100 rounded-md">
        <nav className="hidden lg:flex">
          <ul className="space-y-7">
            <li
              className={`hover:text-red-500 cursor-pointer ${isProfilePage ? "text-red-500" : ""}`}
            >
              <Link href={`/admin/settings`}>Profile</Link>
            </li>
            <li
              className={`hover:text-red-500 cursor-pointer ${isPrivacyPage ? "text-red-500" : ""}`}
            >
              <Link href={`/admin/settings/security`}>Privacy & Security</Link>
            </li>
            {/* Future: Notification */}
            {/* <li className={`hover:text-red-500 cursor-pointer ${isNotificationPage ? "text-red-500" : ""}`}>
              <Link href="/author/1/profile/notification">Notification</Link>
            </li> */}
            <li
              onClick={() => setShowModal(true)}
              className={`hover:text-red-500 cursor-pointer ${showModal ? "text-red-500" : ""}`}
            >
              Log Out
            </li>
          </ul>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
      <LogoutModal
        type="admin"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleSignOut}
      />
    </div>
  );
};

export default Layout;
