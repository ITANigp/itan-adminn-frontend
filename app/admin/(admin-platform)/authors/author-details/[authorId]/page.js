"use client";

import { api } from "@/utils/auth/adminApi";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faPhone,
  faGlobe,
  faCalendar,
  faBookOpen,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import formatDate from "@/utils/formatDate";

// ── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
      <FontAwesomeIcon icon={icon} className="text-gray-500 text-sm" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const AuthorPage = () => {
  const { authorId } = useParams();
  const router = useRouter();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authorId) return;
    api
      .get(`/admin/authors/${authorId}`)
      .then((res) => setAuthor(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authorId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-red-500 text-3xl mb-3" />
        <p className="text-gray-400 text-sm">Loading author details…</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <FontAwesomeIcon icon={faUser} className="text-gray-400 text-2xl" />
        </div>
        <p className="text-gray-600 font-medium">Author not found</p>
        <Link href="/admin/authors" className="text-red-600 text-sm mt-2 hover:underline">
          Back to Authors
        </Link>
      </div>
    );
  }

  const fullName = `${author.first_name || ""} ${author.last_name || ""}`.trim();
  const initials = fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl pb-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Authors
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-gray-900 via-gray-800 to-red-900" />

        {/* Avatar + Name */}
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end gap-4 mb-5">
            {author.author_profile_image_url ? (
              <Image
                src={author.author_profile_image_url}
                width={80}
                height={80}
                alt={fullName}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 ring-4 ring-white shadow-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
            )}
            <div className="pb-1">
              <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full mt-1">
                Author
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-x-8">
            <InfoRow icon={faEnvelope} label="Email" value={author.email} />
            <InfoRow icon={faPhone} label="Phone" value={author.phone_number} />
            <InfoRow icon={faGlobe} label="Country" value={author.country} />
            <InfoRow icon={faCalendar} label="Joined" value={formatDate(author.created_at)} />
          </div>
        </div>
      </div>

      {/* Bio Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-gray-400" />
          Biography
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {author.bio || "This author has not added a biography yet."}
        </p>
      </div>

      {/* Books Card */}
      {author.books?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faBookOpen} className="text-gray-400" />
            Published Books
            <span className="ml-auto text-sm font-normal text-gray-400">{author.books.length} book{author.books.length !== 1 ? "s" : ""}</span>
          </h3>
          <div className="space-y-2">
            {author.books.map((book) => (
              <Link
                key={book.id}
                href={`/admin/books/book-details/${book.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shrink-0 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookOpen} className="text-gray-400 text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{book.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(book.created_at)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  book.approval_status === "approved" ? "bg-green-50 text-green-700" :
                  book.approval_status === "rejected" ? "bg-red-50 text-red-700" :
                  "bg-yellow-50 text-yellow-700"
                }`}>
                  {book.approval_status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorPage;
