"use client"

import React, { useState } from 'react'
import { useRouter } from "next/navigation";

import { useForm } from "@/context/FormContext";

const BookContent = () => {
  const { formData, updateFormData } = useForm();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("")

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    updateFormData({ [e.target.name]: file });
  };

  
  return (
    <div>
      <h3>Manuscript</h3>
      <p>
        Upload your manuscript [i.e. your book’s interior content]. We recommend
        using a PDF file.
      </p>

      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          // checked={checked}
          // onChange={(e) => setChecked(e.target.checked)}
          className="w-5 h-5"
        />
        <span className="text-gray-700">Accept Terms & Conditions</span>
      </label>

      <button>Upload manuscript</button>
       <input
        type="file"
        name="ebook_file"
        accept=".pdf,.epub"
        onChange={handleFileChange}
        className="border p-2 w-full"
      />
      <h3>Book Cover</h3>
      <p>
        Make a lasting impression! Upload a captivating front cover that
        showcases your book's personality and draws readers in.
      </p>

      <input
        type="file"
        name="cover_image"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 w-full"
      />

      <h3>AI Content Generated</h3>
      <p>
        Itan is collecting information about the use of Artificial Intelligence
        (AI) tools in creating content
      </p>
      <p>
        Did you use AI tools in creating texts, images, and/or translations in
        your book?
      </p>
      <div className="flex flex-col space-y-2 p-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="choice"
            value="option1"
            checked={selectedOption === "option1"}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="hidden"
          />
          <div
            className={`w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center ${
              selectedOption === "option1" ? "bg-blue-500" : "bg-white"
            }`}
          >
            {selectedOption === "option1" && (
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            )}
          </div>
          <span className="text-gray-700">Yes</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="choice"
            value="option2"
            checked={selectedOption === "option2"}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="hidden"
          />
          <div
            className={`w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center ${
              selectedOption === "option2" ? "bg-blue-500" : "bg-white"
            }`}
          >
            {selectedOption === "option2" && (
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            )}
          </div>
          <span className="text-gray-700">No</span>
        </label>
      </div>

      <h3>Book ISBN</h3>
      <p>ISBN (Optional) </p>
      <input type="text" />
      <p>Publisher (Optional) </p>
      <input type="text" />

      <div>
        <button onClick={() => router.push("/dashboard/authors/1/books/create/book-details")}>Back to details</button>
        <button onClick={() => router.push("/dashboard/authors/1/books/create/book-pricing")}>Next</button>
      </div>
    </div>
  );
}

export default BookContent