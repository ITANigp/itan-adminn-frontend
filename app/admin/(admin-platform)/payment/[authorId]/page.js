"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/utils/auth/adminApi";
import {
  ArrowLeft,
  User,
  Mail,
  BookOpen,
  TrendingUp,
  Calendar,
  HardDrive,
  ExternalLink,
} from "lucide-react"; // Highly recommended icons

export default function AuthorDetailsPage() {
  const { authorId } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await api.get(`/admin/author_revenues/${authorId}`);
        setData(response.data);
      } catch (err) {
        setError("Failed to load author details.");
      } finally {
        setLoading(false);
      }
    };
    if (authorId) fetchAuthorDetails();
  }, [authorId]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">
          Gathering financial data...
        </p>
      </div>
    );

  if (error || !data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-red-500 mb-4 text-5xl">⚠️</div>
          <p className="text-slate-800 text-xl font-bold mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-slate-500 mb-6">
            {error || "The author data could not be retrieved."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const totalRevenue = data.pending_revenues
    .reduce((acc, sale) => acc + parseFloat(sale.amount), 0)
    .toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Payment
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Admin View
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Hero Section: Author Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <User size={24} />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900">
                    {data.author.name}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} /> {data.author.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} /> {data.pagination.total_count} Total
                    Sales
                  </span>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 uppercase">
                Awaiting Settlement
              </span>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Account Status
                </p>
                <p className="text-slate-700 font-semibold">
                  Active Contributor
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Last Recorded Sale
                </p>
                <p className="text-slate-700 font-semibold">
                  {data.pending_revenues[0]
                    ? new Date(
                        data.pending_revenues[0].created_at,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 shadow-lg shadow-indigo-100 flex flex-col justify-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -right-4 -top-4 text-white opacity-10 rotate-12">
              <TrendingUp size={160} />
            </div>
            <p className="text-indigo-100 font-medium mb-1 relative z-0">
              Total Pending Payout
            </p>
            <h2 className="text-5xl font-black text-white relative z-0 tracking-tight">
              <span className="text-2xl font-light opacity-80 mr-1">$</span>
              {totalRevenue}
            </h2>
            <p className="mt-4 text-indigo-200 text-xs font-medium bg-white/10 w-fit px-3 py-1 rounded-full">
              Includes {data.pending_revenues.length} line items
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Sales Ledger</h3>
            <div className="text-xs text-slate-400 font-medium">
              Showing {data.pending_revenues.length} recent transactions
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Product Info
                  </th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Purchase Details
                  </th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                    Net Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.pending_revenues.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1">
                          {sale.book.title}{" "}
                          <ExternalLink
                            size={12}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Calendar size={12} />{" "}
                          {new Date(
                            sale.purchase.purchase_date,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Price:</span>
                          <span className="font-semibold text-slate-700">
                            {(parseFloat(sale.purchase.price) / 100).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Type:</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 uppercase font-bold text-[9px] tracking-tighter">
                            {sale.purchase.content_type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-slate-600 flex items-center gap-1.5">
                        <HardDrive size={14} className="text-slate-300" />
                        {sale.file_size_mb} MB
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-base font-black text-emerald-600">
                        ${sale.amount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pending_revenues.length === 0 && (
            <div className="py-20 text-center">
              <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                <BookOpen size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                No sales records available for this period.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}