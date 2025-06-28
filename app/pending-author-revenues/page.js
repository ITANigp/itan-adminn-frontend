"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/auth/adminApi"; // axios instance with baseURL and withCredentials set

export default function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingAuthorRevenues = async () => {
      try {
        const res = await api.get("/admin/author_revenues");
        console.log("author's revenue: ", res.data)
        const data = res.data.pending_by_author || [];
        setAuthors(data);
      } catch (error) {
        console.error("Error fetching author revenues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAuthorRevenues();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ul className="space-y-4">
      {authors.map((author) => (
        <li key={author.author_id} className="border p-4 rounded">
          <p>Email: {author.email}</p>
          <p>Total Pending: ${author.total_pending_amount}</p>
          <p>Pending Count: {author.pending_count}</p>
          <a
            href={`/pending-author-revenues/${author.author_id}`}
            className="text-blue-600 underline"
          >
            View Details
          </a>
        </li>
      ))}
    </ul>
  );
}
