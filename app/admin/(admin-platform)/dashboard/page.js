"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBookReader,
  faUserEdit,
  faMoneyBillWave,
  faArrowTrendDown,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

ChartJS.register(ArcElement);

export default function Dashboard() {
  const [areaData, setAreaData] = useState({
    series: [],
    options: {},
  });

  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    setAreaData({
      series: [
        {
          name: "Transactions",
          data: [
            12000000, 18000000, 15000000, 21000000, 19500000, 20500000,
            23000000,
          ],
        },
      ],
      options: {
        chart: { type: "area", height: 350, toolbar: { show: false } },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        colors: ["#EF4444"],
      },
    });

    setDoughnutData({
      labels: ["Pending", "Approved"],
      datasets: [
        {
          data: [87, 344],
          backgroundColor: ["#FF3C00", "#00C851"],
        },
      ],
    });
  }, []);

  const Dougnut = () => (
    <div className="w-full max-w-[100px] sm:max-w-[120px] md:max-w-[140px]">
      {doughnutData?.datasets && <Doughnut data={doughnutData} />}
    </div>
  );

  const booksBought = [
    { name: "Fate", amount: "$50", date: "07 Mar 2025 12:35PM" },
    { name: "Psychology of Money", amount: "$30", date: "08 Mar 2025 10:30PM" },
  ];

  const notifications = [
    {
      type: "Reader Notification",
      text: "Tony Tetuila just bought a psychology of money at 12:34pm...",
    },
    {
      type: "User Notification",
      text: "Matthew Paul just onboarded on Itan Book app at 10:30pm...",
    },
    {
      type: "Author Notification",
      text: "Clifford Green just published a book, waiting to be reviewed...",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4">
      <main className="w-full">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Books",
              value: "1589",
              color: "purple",
              icon: faBook,
              trend: -5.5,
            },
            {
              title: "Readers",
              value: "9,458",
              color: "green",
              icon: faBookReader,
              trend: +6.5,
            },
            {
              title: "Authors",
              value: "2,946",
              color: "teal",
              icon: faUserEdit,
              trend: -5.5,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 shadow-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-md font-semibold text-gray-700 mb-2">
                    {item.title}
                  </h2>
                  <h3 className="text-3xl font-bold text-black">
                    {item.value}
                  </h3>
                </div>
                <div className={`bg-${item.color}-100 p-4 rounded-full`}>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-${item.color}-500 text-2xl`}
                  />
                </div>
              </div>
              <div
                className={`flex items-center mt-2 text-sm ${item.trend < 0 ? "text-red-500" : "text-green-500"}`}
              >
                <FontAwesomeIcon
                  icon={item.trend < 0 ? faArrowTrendDown : faArrowTrendUp}
                  className="mr-1"
                />
                <span className="font-medium">{item.trend}%</span>
                <span className="text-gray-500 ml-1">since last month</span>
              </div>
            </div>
          ))}

          {/* Doughnut Chart */}
          <div className="bg-white rounded-2xl p-4 shadow-md w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="text-green-500 text-2xl mb-2"
                />
                <h3 className="text-xl font-bold text-black">1,289</h3>
                <h2 className="text-sm font-semibold text-gray-700 mt-2">
                  Approved Payments
                </h2>
              </div>
              <Dougnut />
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="mb-2 text-lg font-semibold">
              Transaction Analytics
            </h2>
            {areaData.series.length > 0 && (
              <ApexChart
                options={areaData.options}
                series={areaData.series}
                type="area"
                height={300}
              />
            )}
          </div>
        </div>

        {/* Books & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <h2 className="mb-4 text-lg font-semibold">Books Bought</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="pb-2">Book Name</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {booksBought.map((book, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2">{book.name}</td>
                    <td className="py-2">{book.amount}</td>
                    <td className="py-2">{book.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
            <ul className="space-y-3">
              {notifications.map((note, idx) => (
                <li key={idx} className="border p-3 rounded hover:shadow">
                  <strong>{note.type}</strong>
                  <p className="text-sm text-gray-600">{note.text}</p>
                  <button className="text-blue-500 text-sm mt-1">
                    Read More
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
