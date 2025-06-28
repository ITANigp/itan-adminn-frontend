"use client";

import { api } from "@/utils/auth/authorApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const BookPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      api
        .get(`/books/${bookId}`)
        .then((response) => {
          setBook(response.data.data);
          console.log("Single Book: ", response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching book:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [bookId]);

  if (loading) return <p>Loading book details...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="md:p-4 lg:ml-64  lg:mt-24">
      <div className="sm:flex sm:space-x-4">
        <div className="">
          {book.cover_image_url && (
            <div className="">
              <h2 className="text-x2l font-bold">Ebook Details</h2>
              <img
                className="h-60 w-64 object-cover rounded-lg mt-4"
                src={book?.cover_image_url}
                alt={book.title}
              />
              <p className="mt-2">Book Type: Ebook</p>
            </div>
          )}
        </div>
        <div className="w-full mt-9">
          <div className="flex justify-between items-center max-w-[450px] md:max-w-[600px]">
            <div>
              <p className="font-bold">{book?.title}</p>
              <p className="text-gray-600">
                by:{" "}
                <span className="font-bold">
                  {book?.author_name || "Author's Name"}
                </span>
              </p>
            </div>
            <p className="text-2xl font-bold">${book?.ebook_price}</p>
          </div>
          <p className="mt-4">
            {book?.description || "No description available."}
          </p>
          <Link
            href={book?.ebook_file_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 py-1 px-2 rounded-md text-white mt-3"
          >
            Read
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
