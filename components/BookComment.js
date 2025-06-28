"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

const BookComment = ({ book, onActionSubmit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (type) => {
    setAction(type);
    setShowModal(true);
    setShowMenu(false);
  };

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onActionSubmit(book.id, action, comment);
    setShowModal(false);
    setComment("");
  };

  return (
    <div className="relative" ref={ref}>
      <FontAwesomeIcon
        icon={faEllipsisH}
        className="cursor-pointer h-4 w-9"
        onClick={() => setShowMenu((prev) => !prev)}
      />

      {showMenu && (
        <div className="absolute right-0 mt-2 z-20 bg-white border shadow-md p-2 rounded w-28 space-y-1">
          <button
            onClick={() => handleClick("approve")}
            className="text-green-600 text-sm text-left hover:underline"
          >
            Accept
          </button>
          <button
            onClick={() => handleClick("reject")}
            className="text-red-600 text-sm text-left hover:underline"
          >
            Reject
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-3 capitalize">
              {action} Comment
            </h3>
            <textarea
              className="w-full h-28 p-2 border rounded mb-4"
              placeholder={`Enter comment for ${action}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookComment;
