"use client";

import { useState } from "react";
import { api } from "@/utils/auth/adminApi";

const AdminFinancePage = () => {
  const [batchId, setBatchId] = useState("");
  const [transferResponse, setTransferResponse] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "2025-06-17",
    end: "2025-07-17",
  });

  const formatCurrency = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const handleTransferFunds = async () => {
    setTransferLoading(true);
    try {
      const res = await api.post("/admin/author_revenues/transfer_funds", {
        batch_id: batchId,
      });
      setTransferResponse(res.data);
    } catch (err) {
      setTransferResponse({
        error: true,
        message: err?.response?.data?.message || "Failed to transfer funds",
      });
    } finally {
      setTransferLoading(false);
    }
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await api.get("/admin/analytics/financial_summary", {
        params: {
          start_date: dateRange.start,
          end_date: dateRange.end,
        },
        headers: {
          Authorization: `Bearer YOUR_ADMIN_TOKEN`,
        },
      });
      setSummary(res.data);
    } catch (err) {
      console.error("Summary fetch error:", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-12 bg-gray-100 min-h-screen">
      {/* Transfer Funds */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Transfer Funds
        </h2>
        <input
          type="text"
          placeholder="Enter Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleTransferFunds}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={transferLoading}
        >
          {transferLoading ? "Transferring..." : "Initiate Bank Transfer"}
        </button>

        {transferResponse && (
          <div className="mt-4 text-sm text-gray-800">
            {transferResponse.error ? (
              <p className="text-red-600">{transferResponse.message}</p>
            ) : (
              <pre className="bg-gray-50 p-3 rounded border border-gray-200 whitespace-pre-wrap">
                {JSON.stringify(transferResponse, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Financial Summary
        </h2>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="border border-gray-300 rounded px-3 py-1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="border border-gray-300 rounded px-3 py-1"
            />
          </div>
          <button
            onClick={fetchSummary}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            disabled={summaryLoading}
          >
            {summaryLoading ? "Loading..." : "View Summary"}
          </button>
        </div>

        {summary && (
          <div className="grid sm:grid-cols-2 gap-6 mt-6 text-gray-800">
            <div>
              <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
              <p>₦{formatCurrency(summary.total_revenue)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Paystack Fees</h3>
              <p>₦{formatCurrency(summary.paystack_fees)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Delivery Fees</h3>
              <p>₦{formatCurrency(summary.delivery_fees)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Author Royalties</h3>
              <p>₦{formatCurrency(summary.author_royalties)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Platform Profit</h3>
              <p>₦{formatCurrency(summary.platform_profit)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Completed Sales</h3>
              <p>{summary.completed_purchases_count}</p>
            </div>
          </div>
        )}

        {summary?.breakdown_by_day && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Daily Breakdown</h3>
            <ul className="text-sm space-y-1 max-h-64 overflow-y-auto border p-3 rounded">
              {Object.entries(summary.breakdown_by_day).map(
                ([date, amount]) => (
                  <li key={date} className="flex justify-between">
                    <span>{date}</span>
                    <span>₦{formatCurrency(amount)}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFinancePage;
