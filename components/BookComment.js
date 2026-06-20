"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const BookComment = ({ book, onActionSubmit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (type) => {
    setAction(type);
    setComment("");
    setShowModal(true);
    setShowMenu(false);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await onActionSubmit(book.id, action, comment);
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const isApprove = action === "approve";

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setShowMenu((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors border border-gray-200"
      >
        <FontAwesomeIcon icon={faEllipsisH} className="text-sm" />
      </button>

      {/* Dropdown */}
      {showMenu && (
        <div className="absolute right-0 mt-1.5 z-30 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden w-36">
          <button
            onClick={() => handleClick("approve")}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
            Approve
          </button>
          <div className="h-px bg-gray-100" />
          <button
            onClick={() => handleClick("reject")}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors"
          >
            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
            Reject
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            {/* Icon */}
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-5 ${
                isApprove ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <FontAwesomeIcon
                icon={isApprove ? faCheckCircle : faTimesCircle}
                className={`text-2xl ${isApprove ? "text-green-600" : "text-red-600"}`}
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-1 capitalize">
              {isApprove ? "Approve" : "Reject"} Book
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Provide feedback for{" "}
              <span className="font-medium text-gray-800">"{book.title}"</span>
            </p>

            <textarea
              rows={4}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all placeholder-gray-400"
              placeholder={`Write your ${isApprove ? "approval" : "rejection"} feedback…`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => !submitting && setShowModal(false)}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!comment.trim() || submitting}
                className={`flex-1 py-2.5 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                  isApprove
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {submitting ? (
                  <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Submitting…</>
                ) : (
                  isApprove ? "Approve Book" : "Reject Book"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookComment;
