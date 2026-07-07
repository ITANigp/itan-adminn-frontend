"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBookReader,
  faUserEdit,
  faMoneyBillWave,
  faArrowTrendDown,
  faArrowTrendUp,
  faUserPlus,
  faShoppingCart,
  faClipboardList,
  faCircleExclamation,
  faUserCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import { getDashboardSummary } from "@/utils/auth/adminApi";
import timeAgo from "@/utils/timeAgo";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

ChartJS.register(ArcElement, Tooltip, Legend);

// `label` identifies which role the activity belongs to, so entries can be
// told apart at a glance without reading the full sentence.
const ACTIVITY_ICONS = {
  reader: {
    icon: faUserPlus,
    cls: "bg-green-50 text-green-600",
    label: "Reader",
    labelCls: "bg-green-100 text-green-700",
  },
  reader_confirmed: {
    icon: faUserCheck,
    cls: "bg-green-50 text-green-600",
    label: "Reader",
    labelCls: "bg-green-100 text-green-700",
  },
  author: {
    icon: faUserPlus,
    cls: "bg-purple-50 text-purple-600",
    label: "Author",
    labelCls: "bg-purple-100 text-purple-700",
  },
  author_confirmed: {
    icon: faUserCheck,
    cls: "bg-purple-50 text-purple-600",
    label: "Author",
    labelCls: "bg-purple-100 text-purple-700",
  },
  book: {
    icon: faClipboardList,
    cls: "bg-amber-50 text-amber-600",
    label: "Author",
    labelCls: "bg-amber-100 text-amber-700",
  },
  purchase: {
    icon: faShoppingCart,
    cls: "bg-blue-50 text-blue-600",
    label: "Purchase",
    labelCls: "bg-blue-100 text-blue-700",
  },
  review: {
    icon: faStar,
    cls: "bg-pink-50 text-pink-600",
    label: "Reader",
    labelCls: "bg-green-100 text-green-700",
  },
};

// Tailwind purges classes it can't see as literal strings, so dynamic
// `bg-${color}-50` interpolation would silently disappear from the build —
// this map keeps every class fully static.
const STAT_CARD_COLORS = {
  purple: { bg: "bg-purple-50", text: "text-purple-500" },
  green: { bg: "bg-green-50", text: "text-green-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-500" },
};

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-black/5 animate-pulse">
      <div className="h-4 w-20 bg-gray-100 rounded mb-3" />
      <div className="h-8 w-24 bg-gray-100 rounded mb-4" />
      <div className="h-3 w-32 bg-gray-100 rounded" />
    </div>
  );
}

function StatCard({ title, value, icon, color, percentChange, newThisMonth }) {
  const isUp = percentChange >= 0;
  const colorCls = STAT_CARD_COLORS[color] || STAT_CARD_COLORS.purple;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md ring-1 ring-black/5 transition-shadow w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-1">{title}</h2>
          <h3 className="text-3xl font-bold text-gray-900 tabular-nums">
            {value.toLocaleString()}
          </h3>
        </div>
        <div className={`${colorCls.bg} p-3 rounded-xl`}>
          <FontAwesomeIcon icon={icon} className={`${colorCls.text} text-xl`} />
        </div>
      </div>
      <div
        className={`flex items-center text-sm ${isUp ? "text-green-600" : "text-red-500"}`}
      >
        <FontAwesomeIcon icon={isUp ? faArrowTrendUp : faArrowTrendDown} className="mr-1.5 text-xs" />
        <span className="font-semibold">{Math.abs(percentChange)}%</span>
        <span className="text-gray-400 ml-1.5">
          vs last month ({newThisMonth} new)
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleActivityCount, setVisibleActivityCount] = useState(10);

  useEffect(() => {
    getDashboardSummary()
      .then((data) => setSummary(data))
      .catch(() => setError("Couldn't load dashboard data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const months = summary ? Object.keys(summary.monthly_transactions) : [];
  const amounts = summary ? Object.values(summary.monthly_transactions) : [];

  const areaOptions = {
    chart: { type: "area", height: 320, toolbar: { show: false }, fontFamily: "inherit" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    xaxis: { categories: months, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: {
      labels: { formatter: (val) => `$${val.toLocaleString()}` },
    },
    grid: { borderColor: "#f1f1f1" },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90, 100] },
    },
    colors: ["#E50913"],
    tooltip: { y: { formatter: (val) => `$${val.toLocaleString()}` } },
  };

  const paymentsDoughnut = summary && {
    labels: ["Pending", "Approved"],
    datasets: [
      {
        data: [summary.payments.pending, summary.payments.approved],
        backgroundColor: ["#FBBF24", "#22C55E"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <main className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            A live snapshot of what's happening on Itan.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6">
            <FontAwesomeIcon icon={faCircleExclamation} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {loading || !summary ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Books"
                value={summary.counts.books.total}
                percentChange={summary.counts.books.percent_change}
                newThisMonth={summary.counts.books.new_this_month}
                icon={faBook}
                color="purple"
              />
              <StatCard
                title="Readers"
                value={summary.counts.readers.total}
                percentChange={summary.counts.readers.percent_change}
                newThisMonth={summary.counts.readers.new_this_month}
                icon={faBookReader}
                color="green"
              />
              <StatCard
                title="Authors"
                value={summary.counts.authors.total}
                percentChange={summary.counts.authors.percent_change}
                newThisMonth={summary.counts.authors.new_this_month}
                icon={faUserEdit}
                color="teal"
              />

              {/* Payments doughnut */}
              <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md ring-1 ring-black/5 transition-shadow w-full">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <div className="bg-green-50 w-fit p-3 rounded-xl mb-3">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-xl" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 tabular-nums">
                      {summary.payments.approved.toLocaleString()}
                    </h3>
                    <h2 className="text-sm font-medium text-gray-500 mt-1">
                      Approved Payments
                    </h2>
                  </div>
                  <div className="w-24 shrink-0">
                    <Doughnut
                      data={paymentsDoughnut}
                      options={{ plugins: { legend: { display: false } }, cutout: "70%" }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" /> Approved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending ({summary.payments.pending})
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Area Chart */}
        <div className="mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-black/5">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              Transaction Analytics
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Completed purchase revenue over the last 6 months
            </p>
            {loading ? (
              <div className="h-[320px] flex items-center justify-center text-gray-400 text-sm">
                Loading chart...
              </div>
            ) : amounts.length > 0 ? (
              <ApexChart options={areaOptions} series={[{ name: "Revenue", data: amounts }]} type="area" height={320} />
            ) : (
              <div className="h-[320px] flex items-center justify-center text-gray-400 text-sm">
                No completed purchases in this period yet.
              </div>
            )}
          </div>
        </div>

        {/* Purchases & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-black/5 overflow-x-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Purchases</h2>
            {loading ? (
              <div className="text-sm text-gray-400 py-6 text-center">Loading...</div>
            ) : summary.recent_purchases.length === 0 ? (
              <div className="text-sm text-gray-400 py-6 text-center">
                No purchases yet.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wide">
                    <th className="pb-3 font-medium">Book</th>
                    <th className="pb-3 font-medium">Reader</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-right">When</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recent_purchases.map((purchase) => (
                    <tr key={purchase.id} className="border-t border-gray-50">
                      <td className="py-3 font-medium text-gray-800 max-w-[160px] truncate">
                        {purchase.book_title}
                      </td>
                      <td className="py-3 text-gray-500">{purchase.reader_name}</td>
                      <td className="py-3 text-right font-semibold text-gray-900 tabular-nums">
                        ${purchase.amount.toFixed(2)}
                      </td>
                      <td className="py-3 text-right text-gray-400 text-xs whitespace-nowrap">
                        {timeAgo(purchase.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-black/5">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
            {loading ? (
              <div className="text-sm text-gray-400 py-6 text-center">Loading...</div>
            ) : summary.recent_activity.length === 0 ? (
              <div className="text-sm text-gray-400 py-6 text-center">
                Nothing new to report.
              </div>
            ) : (
              <>
                <ul className="space-y-2">
                  {summary.recent_activity.slice(0, visibleActivityCount).map((event, idx) => {
                    const iconConfig = ACTIVITY_ICONS[event.type] || ACTIVITY_ICONS.reader;
                    return (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${iconConfig.cls}`}>
                          <FontAwesomeIcon icon={iconConfig.icon} className="text-sm" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${iconConfig.labelCls}`}>
                              {iconConfig.label}
                            </span>
                            <p className="text-xs text-gray-400">{timeAgo(event.created_at)}</p>
                          </div>
                          <p className="text-sm text-gray-700 leading-snug">{event.text}</p>
                          {event.email && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{event.email}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {visibleActivityCount < summary.recent_activity.length && (
                  <div className="mt-3 flex justify-center">
                    <button
                      onClick={() => setVisibleActivityCount((count) => count + 10)}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
