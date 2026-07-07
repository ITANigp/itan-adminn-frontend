"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCircleCheck,
  faHourglassHalf,
  faUserPlus,
  faSearch,
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";

import { getAllReaders } from "@/utils/auth/adminApi";
import formatDate from "@/utils/formatDate";

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
const Avatar = ({ name }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center ring-2 ring-white shadow shrink-0">
      <span className="text-white text-sm font-semibold">{initials || "?"}</span>
    </div>
  );
};

const Readers = () => {
  const [readers, setReaders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 20,
  });
  const [readerStats, setReaderStats] = useState({
    verifiedReaders: 0,
    activeTrialReaders: 0,
    newThisMonth: 0,
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setPagination((prev) =>
      prev.currentPage === 1 ? prev : { ...prev, currentPage: 1 }
    );
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchReaders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAllReaders(
          pagination.currentPage,
          pagination.perPage,
          debouncedSearch
        );
        setReaders(response.data || []);

        if (response.meta) {
          setPagination((prev) => ({
            ...prev,
            currentPage: response.meta.current_page || 1,
            totalPages: response.meta.total_pages || 1,
            totalCount: response.meta.total_count || 0,
            perPage: response.meta.per_page || prev.perPage,
          }));

          if (response.meta.stats) {
            setReaderStats({
              verifiedReaders: response.meta.stats.verified_readers || 0,
              activeTrialReaders: response.meta.stats.active_trial_readers || 0,
              newThisMonth: response.meta.stats.new_this_month || 0,
            });
          }
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Your session has expired. Please sign in again.");
        } else {
          setError("Failed to load readers. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReaders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, debouncedSearch]);

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination({ ...pagination, currentPage: pagination.currentPage - 1 });
    }
  };

  const stats = [
    { label: "All Readers", value: (pagination.totalCount || 0).toLocaleString(), icon: faUsers, iconBg: "bg-blue-50", iconColor: "text-blue-500", border: "border-blue-100" },
    { label: "Verified Readers", value: readerStats.verifiedReaders.toLocaleString(), icon: faCircleCheck, iconBg: "bg-orange-50", iconColor: "text-orange-500", border: "border-orange-100" },
    { label: "Active Trial Readers", value: readerStats.activeTrialReaders.toLocaleString(), icon: faHourglassHalf, iconBg: "bg-green-50", iconColor: "text-green-500", border: "border-green-100" },
    { label: "New This Month", value: readerStats.newThisMonth.toLocaleString(), icon: faUserPlus, iconBg: "bg-red-50", iconColor: "text-red-500", border: "border-red-100" },
  ];

  return (
    <div className="px-1 pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Readers</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and monitor all registered readers</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-800">All Readers</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Showing {readers.length} of {pagination.totalCount} reader
              {pagination.totalCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, email, phone…"
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
            <p className="text-gray-400 text-sm">Loading readers…</p>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faUserSlash} className="text-red-400 text-2xl" />
            </div>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : readers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 font-medium">No readers found</p>
            <p className="text-gray-400 text-xs mt-1">
              {debouncedSearch ? "Try adjusting your search" : "No readers have registered yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Name</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {readers.map((reader, index) => (
                    <tr key={reader.id || index} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${reader.first_name || ""} ${reader.last_name || ""}`} />
                          <p className="font-semibold text-gray-900 truncate">
                            {reader.first_name} {reader.last_name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-[220px] truncate">{reader.email}</td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{reader.phone_number || "—"}</td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(reader.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-100">
              {readers.map((reader, index) => (
                <div key={reader.id || index} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={`${reader.first_name || ""} ${reader.last_name || ""}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {reader.first_name} {reader.last_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{reader.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-gray-700">{reader.phone_number || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Joined</p>
                      <p className="text-gray-700">{formatDate(reader.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pagination.currentPage <= 1}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    pagination.currentPage <= 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    pagination.currentPage >= pagination.totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Readers;
