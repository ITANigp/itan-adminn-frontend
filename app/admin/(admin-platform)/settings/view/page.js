"use client";

import { useEffect, useState } from "react";
import { getAuthorProfile } from "@/utils/auth/authorApi";

export default function AuthorProfilePage() {
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getAuthorProfile();
        setAuthor(data);
        console.log("View Author: ", data);
      } catch (err) {
        setError("Failed to load author profile.");
        console.error(err);
      }
    };

    // fetchProfile();
  }, []);

  if (error) {
    return <div className="text-red-600 text-center mt-6">{error}</div>;
  }

  // if (!author) {
  //   return (
  //     <div className="text-center mt-6 text-gray-500">
  //       Loading author profile...
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 mx-auto bg-white rounded-2xl shadow-md mt-10 border my-8 max-w-4xl lg:ml-72 lg:mr-8 lg:mt-24 container">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={author.author_profile_image_url}
          alt="Author"
          className="w-24 h-24 rounded-full object-cover shadow"
        />
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            {author.first_name} {author.last_name}
          </h1>
          <p className="text-gray-500">{author.bio}</p>
        </div>
      </div>

      <div className="space-y-3 text-gray-700">
        <p>
          <span className="font-medium text-gray-800">Phone:</span>{" "}
          {author.phone_number}
        </p>
        <p>
          <span className="font-medium text-gray-800">Country:</span>{" "}
          {author.country}
        </p>
        <p>
          <span className="font-medium text-gray-800">Location:</span>{" "}
          {author.location}
        </p>
      </div>
    </div>
  );
}
