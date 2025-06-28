import { useState, useRef } from "react";
import Image from "next/image";
import { api } from "@/utils/auth/authorApi";
import CryptoJS from "crypto-js";

export default function ProfileImageUploader({ profile }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    profile?.author_profile_image_url || "/images/avatar.png"
  );
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const computeChecksum = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const wordArray = CryptoJS.lib.WordArray.create(reader.result);
        const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray));
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const directUploadFile = async (file) => {
    const checksum = await computeChecksum(file);

    const response = await api.post("/direct_uploads", {
      blob: {
        filename: file.name,
        byte_size: file.size,
        checksum,
        content_type: file.type,
      },
    });

    const { signed_id, direct_upload } = response.data;

    const uploadResponse = await fetch(direct_upload.url, {
      method: "PUT",
      headers: {
        ...direct_upload.headers,
        "Content-Length": file.size.toString(),
        "Content-MD5": checksum,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(
        `S3 upload failed: ${uploadResponse.status} - ${errorText}`
      );
    }

    return signed_id;
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

      alert("✅ Image updated!");
      setEditing(false);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
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

  return (
    <div className="flex flex-col items-center lg:flex-row lg:items-center group relative">
      <div className="relative w-16 h-16">
        <Image
          width={64}
          height={64}
          className={`h-16 w-16 rounded-full object-cover ${profile?.author_profile_image_url ? "" : "p-2 bg-slate-400"}`}
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

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        id="profileImg"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Show Save/Cancel only when editing */}
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
  );
}
