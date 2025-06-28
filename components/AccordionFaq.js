"use client";
import { useState } from "react";

export default function AccordionFaq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is IGP?",
      answer:
        `IGP Stands for Itan Global Publishing.
        IGP lets you self-publish eBooks and audiobooks for free, providing direct access to showcase your book on Itan Stores. You can create a dedicated product detail page for your book, enhancing its visibility. Additionally, IGP also provides tools to translate your book into multiple languages and publish audio files (if available), expanding your global readership.`,
    },
    {
      question: "What types of content can I publish through IGP?",
      answer:
        "IGP enables you to publish eBooks and audiobooks. Currently, we do not accept non-fiction books, and periodicals. We’ll keep you updated when we begin onboarding these genres.Content types typically published using IGP include but are not limited to the following: Fiction -Novels  Book Series Children Books  Comics",
    },
    {
      question:
        "Am I able to use IGP for content currently published elsewhere?",
      answer:
        "Yes, if you own the rights to your book, you can publish it with IGP even if it was previously published elsewhere. If your book already has an ISBN from another publisher, it must retain the same title, and author name when published with IGP to continue using that ISBN. Any modifications to these details will require a new edition and a new ISBN.",
    },
    {
      question: "What file formats are supported for eBook manuscripts?",
      answer: "Microsoft Word (DOC/DOCX), Epub, PDF",
    },
    {
      question: "What file formats are supported for Audiobook files?",
      answer: "MP3 – Widely supported, compressed format with good audio quality.WAV - Widely supported, compressed format with good audio quality.",
    },
  ];

  return (
    <section className="text-sm md:text-base md:mt-24">
      <div className="mt-8 font-semibold md:text-xl text-center text-gray-500">
        <h3>
          Frequently Asked Questions <br className="md:hidden" /> (FAQs)
        </h3>
      </div>

      <div className="divide-y divide-gray-200 rounded-lg xl:mb-8 max-w-4xl mx-auto">
        {faqItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => toggleAccordion(index)}
              // CHANGED: Added responsive padding to prevent over-spreading on large screens
              className="flex items-center justify-between w-full p-5 lg:p-6 xl:p-7 font-medium text-gray-500 hover:bg-gray-100 gap-3 lg:gap-4 xl:gap-5"
            >
              {/* CHANGED: Added responsive text sizing */}
              <span className="flex-1 text-left font-semibold lg:text-lg xl:text-xl">
                {item.question}
              </span>
              {/* CHANGED: Added larger screen sizing for icons */}
              <div className="flex items-center justify-center w-6 h-6 xs:w-7 xs:h-7 medium:w-8 medium:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full bg-[#FEE6E6] text-[#EF5353] flex-shrink-0 transition-all duration-300">
                {activeIndex === index ? (
                  // Minus icon when expanded
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // CHANGED: Added larger screen icon sizing
                    className="w-4 h-4 xs:w-5 xs:h-5 medium:w-6 medium:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                ) : (
                  // Plus icon when collapsed
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // CHANGED: Added larger screen icon sizing
                    className="w-4 h-4 xs:w-5 xs:h-5 medium:w-6 medium:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                )}
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              {/* CHANGED: Added responsive padding for content */}
              <div className="p-5 lg:p-6 xl:p-7">
                {/* CHANGED: Added responsive text sizing */}
                <p className="text-gray-500 lg:text-lg xl:text-xl leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
