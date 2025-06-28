"use client";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


import { getAuthorProfile, updateAuthorProfile } from "@/utils/auth/authorApi";
import Image from "next/image";

const Modal = ({ isOpen, onClose, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    phone_number: "",
    country: "",
    location: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getAuthorProfile();
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          phone_number: data.phone_number || "",
          country: data.country || "",
          location: data.location || "",
        });
      } catch (err) {
        setError("Failed to fetch author profile.");
        console.error(err);
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedProfile = await updateAuthorProfile(profile, null);
      setProfile(updatedProfile);
      onProfileUpdate?.();
      onClose();
    } catch (err) {
      console.error("Profile Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white max-h-[90vh] overflow-y-auto  rounded-lg shadow-lg w-full max-w-md p-6 relative ">
        <FontAwesomeIcon
          icon={faXmark}
          alt="close"
          className="w-3 h-5 text-red-600 absolute top-3 right-3 cursor-pointer"
          onClick={onClose}
        />

        <div className="flex items-center space-x-2 mb-6">
          <Image width={50} height={30} src="/images/logo.png" alt="logo" />
        </div>

        <h2 id="modal-title" className="text-center text-xl font-semibold mb-6">
          Profile Details
        </h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              autoFocus
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:border-none focus:ring-1 focus:outline-none focus:ring-teal-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 focus:border-none focus:ring-1 focus:outline-none focus:ring-teal-200 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              placeholder="Describe yourself..."
              value={profile.bio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 placeholder-gray-300 focus:border-none focus:ring-1 focus:outline-none focus:ring-teal-200 rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 focus:border-none focus:ring-1 focus:outline-none focus:ring-teal-200 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Country of Origin
            </label>
            <input
              type="text"
              name="country"
              value={profile.country}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 focus:border-none focus:ring-1 focus:outline-none focus:ring-teal-200 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 focus:border-none focus:ring-1 focus:outline-none focus:ring-teal-200 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 rounded mt-4 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Edit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
