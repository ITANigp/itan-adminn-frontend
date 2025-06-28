"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import formatDate from "@/utils/formatDate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import dynamic from "next/dynamic";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";
import {
  faBook,
  faBookReader,
  faUserEdit,
  faMoneyBillWave,
  faArrowTrendDown,
  faArrowTrendUp,
  faSlidersH,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

import { api, getAllBooks } from "@/utils/auth/adminApi";


const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

ChartJS.register(ArcElement);


 
const Books = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getAllBooks();
        setBooks(books || []);
        console.log("All books from Admin Panel:", books);
      } catch (error) {
        console.error("Failed to fetch books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    if (filter === "all") return true;
    return book.approval_status === filter;
  });

  const handleReject = async (bookId) => {
    try {
      const response = await api.patch(`/admin/books/${bookId}/reject`, {
        admin_feedback:
          "This book needs revisions on chapters 2-4. Content is inappropriate.",
      });
      console.log("Book is rejected: ", response.data);
    } catch (err) {
      console.log("Error rejecting the book: ", err);
    }
  };

  const handleApprove = async (bookId) => {
    try {
      const response = await api.patch(`/admin/books/${bookId}/approve`, {
        admin_feedback: "Congratulations, your book is approved",
      });
      console.log("Book is approved: ", response.data);
    } catch (err) {
      console.log("Error approving the book: ", err);
    }
  };

  if (loading) {
    return <p className="ml-3 mt-5">Loading books...</p>;
  }

  return (
    <div className="ml-3">
      <h2>Payments</h2>
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
          <div key={idx} className="bg-white rounded-2xl p-4 shadow-md w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-md font-semibold text-gray-700 mb-2">
                  {item.title}
                </h2>
                <h3 className="text-3xl font-bold text-black">{item.value}</h3>
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

      <div className="grid grid-cols-2 text-center my-5 items-center">
        <p className="bg-red-500 h-10 flex items-center justify-center text-white">
          Approved
        </p>
        <p className="border border-gray-300 h-10 flex items-center justify-center">
          Pending
        </p>
      </div>

      <div className="overflow-x-auto w-full max-w-[850px] relative">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-700 rounded-lg">
              <TableHead className="text-white">Account Name</TableHead>
              <TableHead className="text-white">Amount</TableHead>
              <TableHead className="text-white">Book Name</TableHead>
              <TableHead className="text-white">Book Type</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white"></TableHead>
            </TableRow>

            <TableRow className="hover:bg-white">
              <TableHead>
                <button
                  onClick={() => setFilter("all")}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  All
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => setFilter("pending")}
                  className="px-4 py-2 bg-yellow-200 rounded"
                >
                  Pending
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => setFilter("rejected")}
                  className="px-4 py-2 bg-red-200 rounded"
                >
                  Rejected
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => setFilter("approved")}
                  className="px-4 py-2 bg-green-200 rounded"
                >
                  Approved
                </button>
              </TableHead>
              <TableHead />
              <TableHead>
                <FontAwesomeIcon
                  icon={faSlidersH}
                  className="text-slate-700 w-6 h-10 py-1 bg-slate-100 shadow-lg rounded-md cursor-pointer"
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/books/book-details/${book.id}`}>
                      <Image
                        src={book.cover_image_url}
                        width={70}
                        height={120}
                        alt="book cover"
                        className="w-24 h-auto"
                      />
                    </Link>
                    <p>{book.title}</p>
                  </TableCell>
                  <TableCell>
                    {book.first_name} {book.last_name}
                  </TableCell>
                  <TableCell>{book?.unique_book_id ? "Ebook" : ""}</TableCell>
                  <TableCell>{book.approval_status}</TableCell>
                  <TableCell>{book.date}</TableCell>
                  <TableCell>{formatDate(book.created_at)}</TableCell>
                  <TableCell className="flex flex-col">
                    <FontAwesomeIcon
                      icon={faEllipsisH}
                      className="cursor-pointer"
                    />
                    <button
                      onClick={() => handleReject(book.id)}
                      className="text-red-600 cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(book.id)}
                      className="text-green-600 cursor-pointer"
                    >
                      Accept
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No books found for "{filter}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Books;
