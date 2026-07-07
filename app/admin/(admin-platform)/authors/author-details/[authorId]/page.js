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
  faLocationDot,
  faCalendar,
  faUserPlus,
  faBookOpen,
  faSpinner,
  faUser,
  faCheckCircle,
  faHourglassHalf,
  faShieldHalved,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import formatDate from "@/utils/formatDate";

const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

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

// ── Status Pill ──────────────────────────────────────────────────────────────
const StatusPill = ({ ok, okLabel, notOkLabel }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
      ok
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-yellow-50 text-yellow-700 border-yellow-200"
    }`}
  >
    <FontAwesomeIcon icon={ok ? faCheckCircle : faHourglassHalf} className="text-[10px]" />
    {ok ? okLabel : notOkLabel}
  </span>
);

// ── Stat Box ─────────────────────────────────────────────────────────────────
const StatBox = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
    <p className="text-lg font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
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
  const stats = author.stats || {};
  const books = author.books || [];

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
          <div className="-mt-12 flex flex-col sm:flex-row sm:items-end gap-4 mb-5">
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
            <div className="pb-1 flex-1">
              <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  Author
                </span>
                <StatusPill ok={author.email_verified} okLabel="Email Verified" notOkLabel="Email Unverified" />
                <StatusPill ok={author.kyc_completed} okLabel="KYC Completed" notOkLabel="KYC Pending" />
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
                  author.two_factor_enabled
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}>
                  <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                  2FA {author.two_factor_enabled ? `Enabled (${author.preferred_2fa_method})` : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-x-8">
            <InfoRow icon={faEnvelope} label="Email" value={author.email} />
            <InfoRow icon={faPhone} label="Phone" value={author.phone_number} />
            <InfoRow icon={faGlobe} label="Country" value={author.country} />
            <InfoRow icon={faLocationDot} label="Location" value={author.location} />
            <InfoRow icon={faCalendar} label="Joined" value={formatDate(author.created_at)} />
            <InfoRow
              icon={faUserPlus}
              label="Sign-up Method"
              value={author.sign_up_method === "email" ? "Email & Password" : author.sign_up_method}
            />
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faWallet} className="text-gray-400" />
          Activity &amp; Earnings
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatBox label="Total Books" value={stats.total_books ?? 0} />
          <StatBox label="Published Books" value={stats.published_books ?? 0} />
          <StatBox label="Total Purchases" value={stats.total_purchases ?? 0} />
          <StatBox label="Completed Purchases" value={stats.completed_purchases ?? 0} />
          <StatBox label="Approved Earnings" value={formatNaira(stats.approved_earnings)} />
          <StatBox label="Pending Earnings" value={formatNaira(stats.pending_earnings)} />
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faBookOpen} className="text-gray-400" />
          Published Books
          <span className="ml-auto text-sm font-normal text-gray-400">
            {books.length} book{books.length !== 1 ? "s" : ""}
          </span>
        </h3>
        {books.length === 0 ? (
          <p className="text-sm text-gray-400">This author has not uploaded any books yet.</p>
        ) : (
          <div className="space-y-2">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/admin/books/book-details/${book.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shrink-0 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookOpen} className="text-gray-400 text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {book.title} {book.draft && <span className="text-gray-400 font-normal">(Draft)</span>}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(book.created_at)}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    book.approval_status === "approved"
                      ? "bg-green-50 text-green-700"
                      : book.approval_status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {book.approval_status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
