"use client"; 

import { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    ai_generated_image: null,
    audiobook_price: "",
    bio: "",
    book_isbn: "",
    categories: [],
    contributors: [],
    cover_image: null,  // For image upload
    description: "",
    ebook_file: null,    // For PDF or EPUB
    ebook_price: "",
    edition_number: 0,
    explicit_images: null,
    first_name: "",
    keywords: ["", "", "", ""],
    last_name: "",
    primary_audience: "",
    publisher: "",
    publishing_rights: null,
    subtitle: "",
    terms_and_conditions: null,
    title: "",
    tags: [],
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook for using the form context
export const useForm = () => useContext(FormContext);
