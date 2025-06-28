"use client";

import React, { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose}) => {
//   if (!isOpen) return null; // Don't render if modal is closed

  const [profile, setProfile] = useState({});
    const [profileImg, setProfileImg] = useState(null);
    const [editing, setEditing] = useState(false); // Track whether the user is editing
    const [error, setError] = useState("");
  
    async function computeChecksum(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          const wordArray = CryptoJS.lib.WordArray.create(reader.result);
          const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray));
          resolve(base64);
        };
        reader.onerror = (error) => reject(error);
      });
    }
  
    async function directUploadFile(file) {
      try {
        const checksum = await computeChecksum(file);
  
        const response = await api.post("/direct_uploads", {
          blob: {
            filename: file.name,
            byte_size: file.size,
            checksum: checksum,
            content_type: file.type,
          },
        });
  
        const { signed_id, direct_upload } = response.data;
  
        if (!direct_upload?.url) {
          throw new Error("Invalid direct upload response");
        }
  
        const uploadResponse = await fetch(direct_upload.url, {
          method: "PUT",
          headers: {
            ...direct_upload.headers,
            "Content-Type": file.type,
            "Content-Length": file.size.toString(),
            "Content-MD5": checksum,
          },
          body: file,
        });
  
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`S3 upload failed: ${uploadResponse.status}`);
        }
  
        console.log(`✅ Successfully uploaded ${file.name} to S3`);
        return signed_id;
      } catch (error) {
        console.error("Direct upload failed:", error);
        throw error;
      }
    }
  
    // Fetch and set profile data when the component mounts
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const { data } = await getAuthorProfile();
          setProfile(data);
        } catch (err) {
          setError("Failed to fetch author profile.");
          console.error(err);
        }
      };
  
      fetchProfile();
    }, []);
  
    const handleFileImage = (e) => {
      if (e.target.files && e.target.files[0]) {
        setProfileImg(e.target.files[0]);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (!profileImg && !editing) {
          alert("Please select a profile image.");
          return;
        }
  
        const profileImage = profileImg
          ? await directUploadFile(profileImg)
          : profile.profile_image;
  
        if (editing) {
          // If editing, update the profile
          const updatedProfile = await updateAuthorProfile(profile, profileImage);
          console.log("Updated Profile: ", updatedProfile);
          setProfile(updatedProfile);
        } else {
          // If creating, create a new profile
          const createdProfile = await createAuthorProfile(profile, profileImage);
          console.log("Created Profile: ", createdProfile);
          setProfile(createdProfile);
        }
        setEditing(false); // Reset the editing flag after submission
      } catch (error) {
        console.error("Profile Error: ", error);
      }
    };
  
    const handleEditClick = () => {
      setEditing(true); // Set the editing flag to true when edit is clicked
    };

    if (error) {
      return <div className="text-red-600">{error}</div>;
    }

  return (
    <div className=" ml-64 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className='w-96 bg-slate-200 rounded-md shadow-lg'>
        <form onSubmit={handleSubmit}>
              <h1>{editing ? "Edit Author's Profile" : "Create Author's Profile"}</h1>
        
              <label>
                First Name:
                <input
                  type="text"
                  value={profile.first_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  disabled={!editing}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={profile.last_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                  disabled={!editing}
                />
              </label>
              <label>
                Bio:
                <textarea
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!editing}
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  value={profile.phone_number || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone_number: e.target.value })
                  }
                  disabled={!editing}
                />
              </label>
              <label>
                Country:
                <input
                  type="text"
                  value={profile.country || ""}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  disabled={!editing}
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  disabled={!editing}
                />
              </label>
        
              <label>
                Profile Image:
                <input type="file" onChange={handleFileImage} disabled={!editing} />
              </label>
        
              {profile.author_profile_image_url && !editing && (
                <div>
                  <h3>Current Profile Image</h3>
                  <Image
                    src={profile.author_profile_image_url}
                    alt="Author Profile"
                    width={100}
                    height={100}
                  />
                </div>
              )}
        
              <button type="submit">{editing ? "Save Changes" : "Submit"}</button>
        
              {!editing && (
                <button type="button" onClick={handleEditClick}>
                  Edit Profile
                </button>
              )}
            </form>
    </div>
    </div>
  );
};

export default Modal;
