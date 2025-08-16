// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import formatDate from "@/utils/formatDate";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import dynamic from "next/dynamic";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement } from "chart.js";
// import {
//   faBook,
//   faBookReader,
//   faUserEdit,
//   faMoneyBillWave,
//   faArrowTrendDown,
//   faArrowTrendUp,
//   faSlidersH,
//   faEllipsisH,
// } from "@fortawesome/free-solid-svg-icons";

// import { api, getAllBooks } from "@/utils/auth/adminApi";


// const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ChartJS.register(ArcElement);


 
// const Books = () => {
//   const [books, setBooks] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);

//   const [areaData, setAreaData] = useState({
//     series: [],
//     options: {},
//   });

//   const [doughnutData, setDoughnutData] = useState({
//     labels: [],
//     datasets: [],
//   });

//   useEffect(() => {
//     setAreaData({
//       series: [
//         {
//           name: "Transactions",
//           data: [
//             12000000, 18000000, 15000000, 21000000, 19500000, 20500000,
//             23000000,
//           ],
//         },
//       ],
//       options: {
//         chart: { type: "area", height: 350, toolbar: { show: false } },
//         dataLabels: { enabled: false },
//         stroke: { curve: "smooth" },
//         xaxis: {
//           categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//         },
//         fill: {
//           type: "gradient",
//           gradient: {
//             shadeIntensity: 1,
//             opacityFrom: 0.4,
//             opacityTo: 0.1,
//             stops: [0, 90, 100],
//           },
//         },
//         colors: ["#EF4444"],
//       },
//     });

//     setDoughnutData({
//       labels: ["Pending", "Approved"],
//       datasets: [
//         {
//           data: [87, 344],
//           backgroundColor: ["#FF3C00", "#00C851"],
//         },
//       ],
//     });
//   }, []);

//   const Dougnut = () => (
//     <div className="w-full max-w-[100px] sm:max-w-[120px] md:max-w-[140px]">
//       {doughnutData?.datasets && <Doughnut data={doughnutData} />}
//     </div>
//   );


//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const books = await getAllBooks();
//         setBooks(books || []);
//         console.log("All books from Admin Panel:", books);
//       } catch (error) {
//         console.error("Failed to fetch books", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const filteredBooks = books.filter((book) => {
//     if (filter === "all") return true;
//     return book.approval_status === filter;
//   });

//   const handleReject = async (bookId) => {
//     try {
//       const response = await api.patch(`/admin/books/${bookId}/reject`, {
//         admin_feedback:
//           "This book needs revisions on chapters 2-4. Content is inappropriate.",
//       });
//       console.log("Book is rejected: ", response.data);
//     } catch (err) {
//       console.log("Error rejecting the book: ", err);
//     }
//   };

//   const handleApprove = async (bookId) => {
//     try {
//       const response = await api.patch(`/admin/books/${bookId}/approve`, {
//         admin_feedback: "Congratulations, your book is approved",
//       });
//       console.log("Book is approved: ", response.data);
//     } catch (err) {
//       console.log("Error approving the book: ", err);
//     }
//   };

//   if (loading) {
//     return <p className="ml-3 mt-5">Loading books...</p>;
//   }

//   return (
//     <div className="ml-3">
//       <h2>Payments</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
//         {[
//           {
//             title: "Books",
//             value: "1589",
//             color: "purple",
//             icon: faBook,
//             trend: -5.5,
//           },
//           {
//             title: "Readers",
//             value: "9,458",
//             color: "green",
//             icon: faBookReader,
//             trend: +6.5,
//           },
//           {
//             title: "Authors",
//             value: "2,946",
//             color: "teal",
//             icon: faUserEdit,
//             trend: -5.5,
//           },
//         ].map((item, idx) => (
//           <div key={idx} className="bg-white rounded-2xl p-4 shadow-md w-full">
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <h2 className="text-md font-semibold text-gray-700 mb-2">
//                   {item.title}
//                 </h2>
//                 <h3 className="text-3xl font-bold text-black">{item.value}</h3>
//               </div>
//               <div className={`bg-${item.color}-100 p-4 rounded-full`}>
//                 <FontAwesomeIcon
//                   icon={item.icon}
//                   className={`text-${item.color}-500 text-2xl`}
//                 />
//               </div>
//             </div>
//             <div
//               className={`flex items-center mt-2 text-sm ${item.trend < 0 ? "text-red-500" : "text-green-500"}`}
//             >
//               <FontAwesomeIcon
//                 icon={item.trend < 0 ? faArrowTrendDown : faArrowTrendUp}
//                 className="mr-1"
//               />
//               <span className="font-medium">{item.trend}%</span>
//               <span className="text-gray-500 ml-1">since last month</span>
//             </div>
//           </div>
//         ))}

//         {/* Doughnut Chart */}
//         <div className="bg-white rounded-2xl p-4 shadow-md w-full">
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div>
//               <FontAwesomeIcon
//                 icon={faMoneyBillWave}
//                 className="text-green-500 text-2xl mb-2"
//               />
//               <h3 className="text-xl font-bold text-black">1,289</h3>
//               <h2 className="text-sm font-semibold text-gray-700 mt-2">
//                 Approved Payments
//               </h2>
//             </div>
//             <Dougnut />
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 text-center my-5 items-center">
//         <p className="bg-red-500 h-10 flex items-center justify-center text-white">
//           Approved
//         </p>
//         <p className="border border-gray-300 h-10 flex items-center justify-center">
//           Pending
//         </p>
//       </div>

//       <div className="overflow-x-auto w-full max-w-[850px] relative">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-slate-700 hover:bg-slate-700 rounded-lg">
//               <TableHead className="text-white">Account Name</TableHead>
//               <TableHead className="text-white">Amount</TableHead>
//               <TableHead className="text-white">Book Name</TableHead>
//               <TableHead className="text-white">Book Type</TableHead>
//               <TableHead className="text-white">Date</TableHead>
//               <TableHead className="text-white">Status</TableHead>
//               <TableHead className="text-white"></TableHead>
//             </TableRow>

//             <TableRow className="hover:bg-white">
//               <TableHead>
//                 <button
//                   onClick={() => setFilter("all")}
//                   className="px-4 py-2 bg-gray-200 rounded"
//                 >
//                   All
//                 </button>
//               </TableHead>
//               <TableHead>
//                 <button
//                   onClick={() => setFilter("pending")}
//                   className="px-4 py-2 bg-yellow-200 rounded"
//                 >
//                   Pending
//                 </button>
//               </TableHead>
//               <TableHead>
//                 <button
//                   onClick={() => setFilter("rejected")}
//                   className="px-4 py-2 bg-red-200 rounded"
//                 >
//                   Rejected
//                 </button>
//               </TableHead>
//               <TableHead>
//                 <button
//                   onClick={() => setFilter("approved")}
//                   className="px-4 py-2 bg-green-200 rounded"
//                 >
//                   Approved
//                 </button>
//               </TableHead>
//               <TableHead />
//               <TableHead>
//                 <FontAwesomeIcon
//                   icon={faSlidersH}
//                   className="text-slate-700 w-6 h-10 py-1 bg-slate-100 shadow-lg rounded-md cursor-pointer"
//                 />
//               </TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {filteredBooks.length > 0 ? (
//               filteredBooks.map((book) => (
//                 <TableRow key={book.id}>
//                   <TableCell className="font-medium">
//                     <Link href={`/admin/books/book-details/${book.id}`}>
//                       <Image
//                         src={book.cover_image_url}
//                         width={70}
//                         height={120}
//                         alt="book cover"
//                         className="w-24 h-auto"
//                       />
//                     </Link>
//                     <p>{book.title}</p>
//                   </TableCell>
//                   <TableCell>
//                     {book.first_name} {book.last_name}
//                   </TableCell>
//                   <TableCell>{book?.unique_book_id ? "Ebook" : ""}</TableCell>
//                   <TableCell>{book.approval_status}</TableCell>
//                   <TableCell>{book.date}</TableCell>
//                   <TableCell>{formatDate(book.created_at)}</TableCell>
//                   <TableCell className="flex flex-col">
//                     <FontAwesomeIcon
//                       icon={faEllipsisH}
//                       className="cursor-pointer"
//                     />
//                     <button
//                       onClick={() => handleReject(book.id)}
//                       className="text-red-600 cursor-pointer"
//                     >
//                       Reject
//                     </button>
//                     <button
//                       onClick={() => handleApprove(book.id)}
//                       className="text-green-600 cursor-pointer"
//                     >
//                       Accept
//                     </button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-4">
//                   No books found for "{filter}"
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default Books;

"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/auth/adminApi";
import Link from "next/link";

const App = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("approved");
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailedAuthorRevenue, setDetailedAuthorRevenue] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const response = await api.get(`admin/author_revenues`);
        setPendingPayments(response.data.pending_by_author || []);
      } catch (err) {
        console.error("Failed to fetch pending payments:", err);
        setError("Failed to load pending payments.");
        setPendingPayments([]);
      }
    };

    const fetchApprovedPayments = async () => {
      try {
        const response = await api.get(
          `/admin/author_revenues/processed_batches`
        );
        setApprovedPayments(response.data.processed_batches || []);
      } catch (err) {
        console.error("Failed to fetch approved payments:", err);
        setError("Failed to load approved payments.");
        setApprovedPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
    fetchApprovedPayments();
  }, []);

  const handleAuthorClick = (authorId) => {
    setSelectedAuthorId(authorId);
    setShowDetailModal(true);
    fetchDetailedAuthorRevenue(authorId);
  };

  const fetchDetailedAuthorRevenue = async (authorId) => {
    setDetailLoading(true);
    try {
      const response = await api.get(`admin/author_revenues/${authorId}`);
      setDetailedAuthorRevenue(response.data);
    } catch (err) {
      console.error("Failed to fetch detailed author revenue:", err);
      setDetailError("Failed to load details.");
      setDetailedAuthorRevenue(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleAuthorSelection = (authorId) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorId)
        ? prev.filter((id) => id !== authorId)
        : [...prev, authorId]
    );
  };

  const handleProcessPayments = async () => {
    if (selectedAuthors.length === 0) {
      alert("No authors selected");
      return;
    }

    try {
      const response = await api.post(
        `/admin/author_revenues/process_payments`,
        {
          author_ids: selectedAuthors,
        }
      );

      alert(response.data.message);
      setPendingPayments((prev) =>
        prev.filter((p) => !selectedAuthors.includes(p.author_id))
      );
      setSelectedAuthors([]);
    } catch (error) {
      console.error("Payment processing failed:", error);
      alert("Payment processing failed.");
    }
  };

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
          "Transfer failed. Please ensure author has valid bank details."
      );
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedAuthorId(null);
    setDetailedAuthorRevenue(null);
    setDetailError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-lg text-gray-700">Loading payment data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        Author Payment Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex bg-white shadow-lg rounded-lg mb-8 overflow-hidden">
        <button
          className={`flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 ${
            activeTab === "approved"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
        <button
          className={`flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 ${
            activeTab === "pending"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
      </div>

      {/* Approved Payments */}
      {activeTab === "approved" && (
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-full overflow-x-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">
            Approved Author Payments by Batch
          </h2>

          {approvedPayments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                No approved payments found.
              </p>
            </div>
          ) : (
            approvedPayments.map((batch) => (
              <div key={batch.batch_id} className="mb-10 border rounded-lg">
                {/* Batch Info Header */}
                <div className="bg-gray-100 p-4 rounded-t-md border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-gray-700 font-semibold">
                      Batch ID:{" "}
                      <span className="font-mono">{batch.batch_id}</span>
                    </p>
                    <p className="text-gray-700">
                      Total Amount:{" "}
                      <strong>
                        ₦{parseFloat(batch.total_amount).toFixed(2)}
                      </strong>
                    </p>
                    <p className="text-gray-700">
                      Approved Date:{" "}
                      {new Date(batch.approved_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      Approved Count: {batch.approved_count} | Items:{" "}
                      {batch.items_count} | Transferred:{" "}
                      {batch.transferred_count}
                    </p>
                    <p className="text-green-600 font-medium">
                      Status: {batch.status}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTransferFunds(batch.batch_id)}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
                  >
                    Transfer Funds
                  </button>
                </div>

                {/* Author Table */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Author Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batch.authors.map((author) => (
                      <tr key={author.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {author.name?.trim() || "N/A"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {author.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                          Approved
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pending Payments */}
      {activeTab === "pending" && (
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-full overflow-x-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">
            Pending Author Payments
          </h2>
          {pendingPayments.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No pending payments found.
            </p>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Check
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Account Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Count
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingPayments.map((payment) => (
                    <tr
                      key={payment.author_id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAuthorClick(payment.author_id)}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAuthors.includes(payment.author_id)}
                          onChange={() =>
                            toggleAuthorSelection(payment.author_id)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {payment.author_first_name} {payment.author_last_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {payment.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        ₦{parseFloat(payment.total_pending_amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {payment.pending_count}
                      </td>
                      <td className="px-4 py-4 text-sm text-yellow-600 font-semibold">
                        Pending
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4">
                <button
                  onClick={handleProcessPayments}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                >
                  Process Payments
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
          <p>{error}</p>
        </div>
      )}

      <Link
        href="/admin/payment-summary"
        className="mt-10 block text-center text-blue-600 underline"
      >
        View Payment Summary
      </Link>
    </div>
  );
};

export default App;
