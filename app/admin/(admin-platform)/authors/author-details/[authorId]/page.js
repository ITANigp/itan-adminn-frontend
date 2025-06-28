"use client";

import { api } from "@/utils/auth/adminApi";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const AuthorPage = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authorId) {
      api
        .get(`/admin/authors/${authorId}`)
        .then((response) => {
          setAuthor(response.data.data);
          console.log("Author's Details: ", response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching Author Detail:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [authorId]);

  if (loading) return <p>Loading Author details...</p>;
  if (!author) return <p>Author not found.</p>;

  return (
    <div className="md:p-4 lg:ml-64  lg:mt-24">
      <div className="sm:flex sm:space-x-4">
        <div className="">
          {author?.author_profile_image_url ? (
            <Image
              src={author.author_profile_image_url}
              width={32}
              height={32}
              alt={`Profile picture of ${author.first_name} ${author.last_name}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Image
              src="/images/avatar.png"
              width={32}
              height={32}
              alt={`Default avatar for ${author.first_name} ${author.last_name}`}
              className="w-8 h-8 rounded-full object-cover bg-slate-400"
            />
          )}
        </div>
        <div className="w-full mt-9">
          <div className="flex justify-between items-center max-w-[450px] md:max-w-[600px]">
            <div>
              <p className="font-semibold">
                Author's Name:{" "}
                <span className="text-gray-500">
                  {author.first_name} {author.last_name}
                </span>
              </p>
              <p className="font-semibold">
                Author's Email:{" "}
                <span className="text-gray-500">
                  {author.email}
                </span>
              </p>
              <p className="font-semibold">
                Country: <span className="text-gray-500">{author.country}</span>
              </p>
            </div>
          </div>
          <p className="mt-4 font-semibold">
            Author's Biography:{" "}
            <span className="text-gray-500">
              {author?.bio || "No Biography available."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
