"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBooks,
  faDownload,
  faShoppingCart,
  faTimesCircle,
  faSearch,
  faTrashAlt,
  faSpinner,
  faCheckCircle,
  faHourglassHalf,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import formatDate from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { api, getAllBooks, deleteBook } from "@/utils/auth/adminApi";
import BookComment from "@/components/BookComment";

// ── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ book, onConfirm, onCancel, isDeleting, error }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-5">
        <FontAwesomeIcon icon={faTrashAlt} className="text-red-600 text-2xl" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Book</h3>
      <p className="text-gray-500 text-center text-sm mb-6">
        Are you sure you want to permanently delete{" "}
        <span className="font-semibold text-gray-800">"{book.title}"</span>?
        This action cannot be undone.
      </p>
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <FontAwesomeIcon icon={faTimesCircle} className="mt-0.5 shrink-0 text-amber-500" />
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
            <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Deleting…</>
          ) : (
            "Yes, Delete"
          )}
        </button>
      </div>
    </div>
  </div>
);

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = {
    approved: { label: "Approved", icon: faCheckCircle, cls: "bg-green-50 text-green-700 border-green-200" },
    pending:  { label: "Pending",  icon: faHourglassHalf, cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    rejected: { label: "Rejected", icon: faTimesCircle, cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${c.cls}`}>
      <FontAwesomeIcon icon={c.icon} className="text-[10px]" />
      {c.label}
    </span>
  );
};

// ── Filter Pill ──────────────────────────────────────────────────────────────
const FilterPill = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
      active
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
        {count}
      </span>
    )}
  </button>
);

// ── Main Page ────────────────────────────────────────────────────────────────
const Books = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    getAllBooks()
      .then((data) => setBooks(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    all: books.length,
    pending: books.filter((b) => b.approval_status === "pending").length,
    approved: books.filter((b) => b.approval_status === "approved").length,
    rejected: books.filter((b) => b.approval_status === "rejected").length,
  };

  const filtered = books.filter((b) => {
    const matchesFilter = filter === "all" || b.approval_status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      b.title?.toLowerCase().includes(q) ||
      `${b.first_name} ${b.last_name}`.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleActionSubmit = async (bookId, action, comment) => {
    // Let errors propagate to the caller (BookComment) so the modal stays
    // open and shows a message instead of silently closing on failure.
    await api.patch(`/admin/books/${bookId}/${action}`, { admin_feedback: comment });
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, approval_status: action === "approve" ? "approved" : "rejected" } : b
      )
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setDeleteError(null);
    try {
      await deleteBook(deleteTarget.id);
      setBooks((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(
        err.response?.data?.status?.message ||
          "Failed to delete book. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="px-1 pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Books</h1>
        <p className="text-sm text-gray-500 mt-1">Review, approve, and manage all uploaded books</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Books", value: counts.all, icon: faBookOpen, iconBg: "bg-blue-50", iconColor: "text-blue-500", border: "border-blue-100" },
          { label: "Pending Review", value: counts.pending, icon: faHourglassHalf, iconBg: "bg-yellow-50", iconColor: "text-yellow-500", border: "border-yellow-100" },
          { label: "Approved", value: counts.approved, icon: faCheckCircle, iconBg: "bg-green-50", iconColor: "text-green-500", border: "border-green-100" },
          { label: "Rejected", value: counts.rejected, icon: faTimesCircle, iconBg: "bg-red-50", iconColor: "text-red-500", border: "border-red-100" },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border ${s.border} flex items-center gap-4`}>
            <div className={`w-12 h-12 ${s.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <FontAwesomeIcon icon={s.icon} className={`${s.iconColor} text-lg`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "approved", label: "Approved" },
                { key: "rejected", label: "Rejected" },
              ].map((f) => (
                <FilterPill
                  key={f.key}
                  label={f.label}
                  active={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  count={counts[f.key]}
                />
              ))}
            </div>
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search books or authors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{filtered.length} book{filtered.length !== 1 ? "s" : ""} shown</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Book</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-red-500 text-2xl mb-3" />
                    <p className="text-gray-400 text-sm">Loading books…</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FontAwesomeIcon icon={faBookOpen} className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500 font-medium">No books found</p>
                    <p className="text-gray-400 text-xs mt-1">Try a different filter or search term</p>
                  </td>
                </tr>
              ) : (
                filtered.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50/70 transition-colors group">
                    {/* Book */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/books/book-details/${book.id}`}>
                          {book.cover_image_url ? (
                            <Image
                              src={book.cover_image_url}
                              width={44}
                              height={60}
                              alt={book.title}
                              className="w-11 h-14 object-cover rounded-lg shadow-sm shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shrink-0">
                              <FontAwesomeIcon icon={faBookOpen} className="text-gray-400" />
                            </div>
                          )}
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/admin/books/book-details/${book.id}`} className="font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-1">
                            {book.title}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">#{book.unique_book_id || book.id?.toString().slice(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    {/* Author */}
                    <td className="px-6 py-4">
                      <p className="text-gray-700 font-medium">{book.first_name} {book.last_name}</p>
                    </td>
                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                        {book.unique_book_id ? "Ebook" : "Audiobook"}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={book.approval_status} />
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {formatDate(book.created_at)}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookComment book={book} onActionSubmit={handleActionSubmit} />
                        <button
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTarget(book);
                          }}
                          disabled={deletingId === book.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          book={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (deletingId) return;
            setDeleteTarget(null);
            setDeleteError(null);
          }}
          isDeleting={!!deletingId}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default Books;
