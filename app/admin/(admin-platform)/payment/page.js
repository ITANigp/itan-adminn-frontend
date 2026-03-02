"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/auth/adminApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRightLeft,
  LayoutDashboard,
} from "lucide-react"; // Optional: Lucide icons for a pro look

const App = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("approved");
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  const router = useRouter();

  const handleTransferFunds = async (batchId) => {
    try {
      const res = await api.post("/admin/author_revenues/transfer_funds", {
        batch_id: batchId,
      });
      alert("Transfer successful!");
      console.log("Transfer Response:", res.data);
    } catch (err) {
      console.error("Transfer failed:", err);
      alert(
        err?.response?.data?.error ||
          "Transfer failed. Please ensure author has valid bank details.",
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          api.get(`admin/author_revenues`),
          api.get(`/admin/author_revenues/processed_batches`),
        ]);
        setPendingPayments(pendingRes.data.pending_by_author || []);
        setApprovedPayments(approvedRes.data.processed_batches || []);
      } catch (err) {
        setError("Failed to synchronize payment data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAuthorSelection = (authorId) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorId)
        ? prev.filter((id) => id !== authorId)
        : [...prev, authorId],
    );
  };

  const handleProcessPayments = async () => {
    if (selectedAuthors.length === 0)
      return alert("Select at least one author");
    try {
      const response = await api.post(
        `/admin/author_revenues/process_payments`,
        { author_ids: selectedAuthors },
      );
      alert(response.data.message);
      setPendingPayments((prev) =>
        prev.filter((p) => !selectedAuthors.includes(p.author_id)),
      );
      setSelectedAuthors([]);
    } catch (error) {
      alert("Payment processing failed.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Syncing Ledger...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="text-indigo-600" size={24} />
                Author Payouts
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage and approve revenue distributions for authors.
              </p>
            </div>
            <Link
              href="/admin/payment-summary"
              className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              View History
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-200/50 rounded-xl w-fit mb-8 border border-slate-200">
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "approved"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Approved Batches
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "pending"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending Approval ({pendingPayments.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === "approved" ? (
            <div className="grid gap-6">
              {approvedPayments.length === 0 ? (
                <EmptyState message="No approved batches found." />
              ) : (
                approvedPayments.map((batch) => (
                  <div
                    key={batch.batch_id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-medium px-2 py-1 bg-slate-200 rounded text-slate-600">
                            #{batch.batch_id.slice(-8)}
                          </span>
                          <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full uppercase">
                            {batch.status}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-slate-900 tracking-tight">
                          ${parseFloat(batch.total_amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                          {new Date(batch.approved_date).toLocaleDateString(
                            undefined,
                            { dateStyle: "long" },
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => handleTransferFunds(batch.batch_id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
                      >
                        <ArrowRightLeft size={16} />
                        Execute Transfer
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-white">
                          <tr>
                            <th className="px-6 py-4">Author Details</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {batch.authors.map((author) => (
                            <tr
                              key={author.id}
                              className="group hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-slate-800">
                                    {author.name || "N/A"}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {author.email}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                                  <CheckCircle size={14} /> Ready
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* PENDING SECTION */
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                  Review Pending Payments
                </h3>
                {selectedAuthors.length > 0 && (
                  <button
                    onClick={handleProcessPayments}
                    className="animate-in fade-in zoom-in duration-200 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700"
                  >
                    Approve Selected ({selectedAuthors.length})
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[11px] uppercase text-slate-400 font-bold">
                    <tr>
                      <th className="px-6 py-3 w-10"></th>
                      <th className="px-6 py-3">Recipient</th>
                      <th className="px-6 py-3">Items</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingPayments.map((payment) => (
                      <tr
                        key={payment.author_id}
                        className={`group transition-colors cursor-pointer ${selectedAuthors.includes(payment.author_id) ? "bg-indigo-50/50" : "hover:bg-slate-50"}`}
                        onClick={() =>
                          router.push(`/admin/payment/${payment.author_id}`)
                        }
                      >
                        <td
                          className="px-6 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedAuthors.includes(
                              payment.author_id,
                            )}
                            onChange={() =>
                              toggleAuthorSelection(payment.author_id)
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">
                              {payment.author_first_name}{" "}
                              {payment.author_last_name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {payment.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {payment.pending_count} sales
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-bold text-slate-900">
                            $
                            {parseFloat(payment.total_pending_amount).toFixed(
                              2,
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
    <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
      <Clock className="text-slate-400" size={24} />
    </div>
    <p className="text-slate-500 font-medium">{message}</p>
  </div>
);

export default App;