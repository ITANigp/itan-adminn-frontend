"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import formatDate from "@/utils/formatDate";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api, getAllBooks } from "@/utils/auth/adminApi";
import BookComment from "@/components/BookComment";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getAllBooks();
        setBooks(books || []);
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

  const handleActionSubmit = async (bookId, action, comment) => {
    try {
      const res = await api.patch(`/admin/books/${bookId}/${action}`, {
        admin_feedback: comment,
      });

      if (res.status === 200) {
        console.log(`${action} successful with comment: ${comment}`);
        // Refresh list if needed
      } else {
        console.error("Action failed");
      }
    } catch (err) {
      console.error("Error submitting action:", err);
    }
  };

  if (loading) {
    return <p className="ml-3 mt-5">Loading books...</p>;
  }

  return (
    <div className="ml-3">
      <h2>Books</h2>

      {/* Metrics Summary */}
      <div className="grid gap-y-5 mb-5 xxs:grid-cols-2 xs:grid-cols-3 medium:grid-cols-3 sm:grid-cols-4 max-w-[600px] justify-between mt-3">
        {[
          { label: "All Books", color: "", count: 10450 },
          { label: "Download Books", color: "text-orange-300", count: 10450 },
          { label: "Bought Books", color: "text-green-600", count: 10450 },
          { label: "Rejected Books", color: "text-red-600", count: 10450 },
        ].map(({ label, color, count }, i) => (
          <div
            key={i}
            className={`flex flex-col w-[120px] h-[120px] justify-evenly pt-3 items-center border border-orange-200 rounded-md ${color}`}
          >
            <p className="text-sm">{label}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="overflow-x-auto w-full max-w-[850px] relative">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-700 hover:bg-slate-700 rounded-lg">
              <TableHead className="text-white">Book Name</TableHead>
              <TableHead className="text-white">Author</TableHead>
              <TableHead className="text-white">Book Types</TableHead>
              <TableHead className="text-white">Book Status</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Uploaded</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>

            <TableRow>
              {["all", "pending", "rejected", "approved"].map((type) => (
                <TableHead key={type}>
                  <button
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded ${
                      filter === type
                        ? `bg-${
                            type === "approved"
                              ? "green"
                              : type === "rejected"
                                ? "red"
                                : type === "pending"
                                  ? "yellow"
                                  : "gray"
                          }-500 text-white`
                        : `bg-${
                            type === "approved"
                              ? "green"
                              : type === "rejected"
                                ? "red"
                                : type === "pending"
                                  ? "yellow"
                                  : "gray"
                          }-100 text-gray-600`
                    }`}
                  >
                    {type[0].toUpperCase() + type.slice(1)}
                  </button>
                </TableHead>
              ))}
              <TableHead />
              <TableHead />
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
                  <TableCell>
                    <BookComment
                      book={book}
                      onActionSubmit={handleActionSubmit}
                    />
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
