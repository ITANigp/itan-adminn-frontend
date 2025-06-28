"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import FormModal from "@/components/ProfileFormModal";
import directUploadFile from "@/utils/updateAuthorImg";
import { getAuthorProfile, api } from "@/utils/auth/authorApi";

const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/images/avatar.png");
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  // useEffect(() => {
  //   fetchProfile();
  // }, []);

  const fetchProfile = async () => {
    try {
      // const { data } = await getAuthorProfile();
      // setProfile(data);
      setPreviewUrl(data?.author_profile_image_url || "/images/avatar.png");
    } catch (err) {
      console.error(err);
      // setError("Failed to fetch author profile.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setEditing(true);
  };

  const handleSubmitImg = async () => {
    if (!imageFile) return;
    setUploading(true);

    try {
      const signedId = await directUploadFile(imageFile);

      const formData = new FormData();
      formData.append("author[author_profile_image]", signedId);

      await api.patch("/authors/profile", formData);

      toast.success("✅ Image updated!");
      setEditing(false);
      fetchProfile(); // refresh profile info
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setImageFile(null);
    setPreviewUrl(profile?.author_profile_image_url || "/images/avatar.png");
  };

  const triggerFileInput = () => {
    inputRef.current.click();
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="h-screen">
      <section className="text-center mx-auto">
        <div className="flex justify-between lg:hidden">
          <FontAwesomeIcon
            icon={faChevronLeft}
            onClick={() => router.back()}
            className="ml-3 p-2 py-1 rounded-md cursor-pointer hover:bg-gray-400"
          />
          <h2 className="font-bold text-xl mb-5">Profile</h2>
          <p className="mr-7 lg:hidden" />
        </div>

        <div className="lg:flex max-w-lg lg:items-center lg:shadow-md lg:rounded-lg lg:bg-white space-x-2 p-3 mx-auto mb-5">
          <div className="flex flex-col items-center lg:flex-row lg:items-center group relative">
            <div className="relative w-16 h-16">
              <Image
                width={64}
                height={64}
                className={`h-16 w-16 rounded-full object-cover ${
                  profile?.author_profile_image_url ? "" : "p-2 bg-slate-400"
                }`}
                alt="Profile"
                src={previewUrl}
              />

              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Edit
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              id="profileImg"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {editing && (
              <div className="mt-2 flex gap-2 lg:ml-4">
                <button
                  type="button"
                  onClick={handleSubmitImg}
                  disabled={uploading}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={uploading}
                  className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="lg:flex lg:flex-col lg:items-start">
            <h3 className="mt-4 font-semibold">
              {profile.first_name} {profile.last_name}
            </h3>
            <p className="text-gray-400">Admin</p>
            <p className="text-gray-400 italic">{profile.email}</p>
          </div>
        </div>
      </section>

      <section className="flex mx-auto flex-col items-center max-w-lg shadow-md rounded-lg bg-white lg:mt-0 lg:mb-5 m-16 pt-1 p-2 text-sm">
        <div className="flex justify-between w-full mb-5">
          <p className="py-1">Personal Information</p>
          <div
            // onClick={() => setOpenModal(true)}
            className="h-6 pt-[2px] my-auto px-[7px] hover:bg-red-100 rounded-md cursor-pointer space-x-1 -mx-2"
          >
            <Image
              width={12}
              height={15}
              className="inline"
              src="/images/edit-profile.png"
              alt="edit"
            />
            <p className="text-red-500 text-sm inline">Edit</p>
          </div>
        </div>

        <div className="flex justify-between w-full border-b mb-2">
          <p>First Name</p>
          <p className="text-gray-400">{profile.first_name}</p>
        </div>

        <div className="flex justify-between w-full border-b mb-2">
          <p>Last Name</p>
          <p className="text-gray-400">{profile.last_name}</p>
        </div>

        <div className="flex justify-between w-full border-b mb-2">
          <p>Bio</p>
          <p className="text-gray-400">{profile.bio}</p>
        </div>

        <div className="flex justify-between w-full border-b mb-3">
          <p>Phone Number</p>
          <p className="text-gray-400">{profile.phone_number}</p>
        </div>
      </section>

      <section className="flex flex-col items-center max-w-lg mx-auto shadow-md rounded-lg bg-white m-5 lg:mt-0 pt-1 p-2 text-sm">
        <div className="flex justify-between w-full mb-5">
          <p className="py-1">Address</p>
          <div className="h-6 pt-[2px] my-auto px-[7px] hover:bg-red-100 rounded-md cursor-pointer space-x-1 -mx-2"></div>
        </div>

        <div className="flex justify-between w-full border-b mb-2">
          <p>Country</p>
          <p className="text-gray-400">{profile.country}</p>
        </div>

        <div className="flex justify-between w-full border-b mb-3">
          <p>Location</p>
          <p className="text-gray-400">
            {profile.location === "null" ? "..." : profile.location}
          </p>
        </div>
      </section>

      <FormModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onProfileUpdate={fetchProfile}
      />
    </div>
  );
};

export default Profile;
