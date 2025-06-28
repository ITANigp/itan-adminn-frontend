"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/utils/auth/adminApi";

export default function AuthorPaymentProcessor() {
  const { author_id } = useParams();

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    if (!author_id) return;

    const fetchDetails = async () => {
      try {
        const res = await api.get(`/admin/author_revenues/${author_id}`);
        setAuthor(res.data.author);
      } catch (err) {
        console.error("Error fetching author detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [author_id]);

  const handleProcessPayment = async () => {
    if (!author_id) return;
    setProcessing(true);

    try {
      const res = await api.post(
        "/admin/author_revenues/process_payments",
        {
          author_ids: [author_id],
        },
        
      );

      setPaymentResult(res.data);
      console.log("Payment result:", res.data);
    } catch (err) {
      console.error("Error processing payment:", err);
      setPaymentResult({ error: "Failed to process payment." });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Loading author details...</p>;
  if (!author) return <p>No author found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Author Payment</h1>

      <div className="space-y-2 mb-6">
        <p>
          <strong>ID:</strong> {author.id}
        </p>
        <p>
          <strong>Email:</strong> {author.email}
        </p>
        <p>
          <strong>Name:</strong> {author.name?.trim() || "N/A"}
        </p>
      </div>

      <button
        onClick={handleProcessPayment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={processing}
      >
        {processing ? "Processing..." : "Process Payment"}
      </button>

      {paymentResult && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-sm">
          <h2 className="font-semibold mb-2">Payment Result</h2>
          {paymentResult.success ? (
            <div>
              <p>✅ Payment processed successfully</p>
              <p>
                <strong>Batch ID:</strong> {paymentResult.batch_id}
              </p>
              <p>
                <strong>Reference:</strong>{" "}
                {paymentResult.processed.authors[0]?.payment_reference}
              </p>
              <p>
                <strong>Amount:</strong> $
                {paymentResult.processed.authors[0]?.amount}
              </p>
            </div>
          ) : (
            <p className="text-red-600">
              ❌ {paymentResult.error || "Payment failed."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
