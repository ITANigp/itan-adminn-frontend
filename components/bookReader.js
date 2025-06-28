"use client";

import { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

export default function BookReader({ pages }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [highlights, setHighlights] = useState({});
  const [comments, setComments] = useState({});
  const [selectedText, setSelectedText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const userId = "paul"; // hardcoded for now

  // Load user progress
  useEffect(() => {
    const loadProgress = async () => {
      const res = await fetch(`/api/progress?userId=${userId}`);
      const data = await res.json();
      setCurrentPage(data.data.currentPage);
      setIsCompleted(data.data.isCompleted);
    };

    loadProgress();
  }, []);

  // Load highlights/comments for current page
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/highlights?page=${currentPage}`);
      const data = await res.json();
      const pageData = data.data || [];
      setComments((prev) => ({ ...prev, [currentPage]: pageData }));
      setHighlights((prev) => ({
        ...prev,
        [currentPage]: pageData.map((item) => item.text),
      }));
    };

    fetchData();
  }, [currentPage]);

  const handlePageFlip = async (e) => {
    const page = e.data;
    setCurrentPage(page);

    await fetch("/api/progress", {
      method: "POST",
      body: JSON.stringify({ userId, currentPage: page }),
    });

    if (page === pages.length - 1) {
      await fetch("/api/progress", {
        method: "POST",
        body: JSON.stringify({ userId, currentPage: page, isCompleted: true }),
      });
      setIsCompleted(true);
    }
  };

  const handleTextSelect = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text) setSelectedText(text);
  };

  const saveHighlightToAPI = async (page, text, comment = "") => {
    await fetch("/api/highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, text, comment }),
    });
  };

  const handleHighlight = async () => {
    if (!selectedText) return;
    await saveHighlightToAPI(currentPage, selectedText);
    setHighlights((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), selectedText],
    }));
    setSelectedText("");
  };

  const handleComment = async (page, text) => {
    const comment = prompt("Enter your comment:");
    if (comment) {
      await saveHighlightToAPI(page, text, comment);
      setComments((prev) => ({
        ...prev,
        [page]: [...(prev[page] || []), { text, comment }],
      }));
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <HTMLFlipBook
        width={400}
        height={500}
        onFlip={handlePageFlip}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        className="shadow-md"
      >
        {pages.map((content, index) => (
          <div
            key={index}
            onMouseUp={handleTextSelect}
            className="bg-white p-6 overflow-y-auto"
          >
            <h2 className="font-bold mb-2">Page {index + 1}</h2>
            <p>
              {content.split(" ").map((word, idx) => {
                const isHighlighted =
                  highlights[index]?.includes(word) ||
                  comments[index]?.some((c) => c.text === word);
                return (
                  <span
                    key={idx}
                    onDoubleClick={() => handleComment(index, word)}
                    className={`cursor-pointer ${
                      isHighlighted ? "bg-yellow-300" : ""
                    }`}
                  >
                    {word}{" "}
                  </span>
                );
              })}
            </p>
          </div>
        ))}
      </HTMLFlipBook>

      {selectedText && (
        <button
          onClick={handleHighlight}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Highlight “{selectedText}”
        </button>
      )}

      {isCompleted && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 font-semibold rounded">
          ✅ You've finished reading the textbook!
        </div>
      )}
    </div>
  );
}
