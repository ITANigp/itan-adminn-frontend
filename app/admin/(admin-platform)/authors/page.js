"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBookOpen,
  faHeadphones,
  faUserXmark,
  faSearch,
  faTrashAlt,
  faChevronRight,
  faSpinner,
  faCheckCircle,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { getAllAuthors, deleteAuthor } from "@/utils/auth/adminApi";
import formatDate from "@/utils/formatDate";

// ── Confirm Delete Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ author, onConfirm, onCancel, isDeleting, error }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-5">
        <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 text-2xl" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Author</h3>
      <p className="text-gray-500 text-center text-sm mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-800">
          {author.first_name} {author.last_name}
        </span>
        ? This will permanently remove the author and all their books.
      </p>
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <FontAwesomeIcon icon={faUserXmark} className="mt-0.5 shrink-0 text-amber-500" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          {isDeleting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Deleting…
            </>
          ) : (
            "Yes, Delete"
          )}
        </button>
      </div>
    </div>
  </div>
);

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ verified, verifiedLabel, unverifiedLabel }) => {
  const cls = verified
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-yellow-50 text-yellow-700 border-yellow-200";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${cls}`}>
      <FontAwesomeIcon icon={verified ? faCheckCircle : faHourglassHalf} className="text-[10px]" />
      {verified ? verifiedLabel : unverifiedLabel}
    </span>
  );
};

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, iconBg, iconColor, border }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border ${border} flex items-center gap-4`}>
    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
      <FontAwesomeIcon icon={icon} className={`${iconColor} text-lg`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

// ── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ src, name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        width={40}
        height={40}
        alt={name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center ring-2 ring-white shadow">
      <span className="text-white text-sm font-semibold">{initials}</span>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllAuthors();
        setAuthors(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = authors.filter((a) => {
    const q = search.toLowerCase();
    return (
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.phone_number?.includes(q)
    );
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAuthor(deleteTarget.id);
      setAuthors((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(
        err.response?.data?.status?.message ||
          "Failed to delete author. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = [
    { label: "All Authors", value: authors.length, icon: faUsers, iconBg: "bg-blue-50", iconColor: "text-blue-500", border: "border-blue-100" },
    { label: "Ebook Authors", value: authors.length, icon: faBookOpen, iconBg: "bg-orange-50", iconColor: "text-orange-500", border: "border-orange-100" },
    { label: "Audiobook Authors", value: 0, icon: faHeadphones, iconBg: "bg-green-50", iconColor: "text-green-500", border: "border-green-100" },
    { label: "Suspended Authors", value: 0, icon: faUserXmark, iconBg: "bg-red-50", iconColor: "text-red-500", border: "border-red-100" },
  ];

  return (
    <div className="px-1 pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and monitor all registered authors</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-800">All Authors</h2>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} author{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
          <div className="relative max-w-xs w-full">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
            />
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="px-6 py-16 text-center">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-red-500 text-2xl mb-3" />
            <p className="text-gray-400 text-sm">Loading authors…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 font-medium">No authors found</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Verified</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">KYC</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((author) => (
                    <tr key={author.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={author.author_profile_image_url}
                            name={`${author.first_name || ""} ${author.last_name || ""}`}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {author.first_name} {author.last_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">{author.email}</td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{author.phone_number || "—"}</td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          verified={author.email_verified}
                          verifiedLabel="Verified"
                          unverifiedLabel="Unverified"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          verified={author.kyc_completed}
                          verifiedLabel="Completed"
                          unverifiedLabel="Pending"
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(author.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/authors/author-details/${author.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            View <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(author)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((author) => (
                <div key={author.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={author.author_profile_image_url}
                      name={`${author.first_name || ""} ${author.last_name || ""}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {author.first_name} {author.last_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{author.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-gray-700">{author.phone_number || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Joined</p>
                      <p className="text-gray-700">{formatDate(author.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Verified</p>
                      <StatusBadge
                        verified={author.email_verified}
                        verifiedLabel="Verified"
                        unverifiedLabel="Unverified"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">KYC</p>
                      <StatusBadge
                        verified={author.kyc_completed}
                        verifiedLabel="Completed"
                        unverifiedLabel="Pending"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/admin/authors/author-details/${author.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      View <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(author)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          author={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (isDeleting) return;
            setDeleteTarget(null);
            setDeleteError(null);
          }}
          isDeleting={isDeleting}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default AuthorsPage;
