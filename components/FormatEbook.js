const FormatEbook = () => {
  return (
    <section className="bg-white overflow-hidden">
      {/* Header with brand accent */}
      <div className="bg-gradient-to-r from-[#FEE6E6] to-[#FFEFF2] p-6 pt-10 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 mb-2">
          Format Your <span className="text-[#EF5353]">eBook</span>
        </h3>
        <h4 className="text-sm text-gray-600 italic">
          Guidelines and specifications for publishing
        </h4>
      </div>

      {/* Main content with proper spacing */}
      <div className="p-6 xs:p-8">
        {/* Supported Formats Section */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">
            What file formats are supported for eBook manuscripts?
          </h4>
          <p className="text-gray-700 mb-4 text-sm">
            IGP supports a variety of formats. Below, you'll find information
            about our recommended and most commonly used formats.
          </p>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">
                    Format
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">
                    Overview
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap font-medium text-gray-800 text-xs">
                    Microsoft Word
                  </td>
                  <td className="px-2 py-4 text-xs text-gray-600">
                    Most DOC/DOCX files convert well to eBooks. Use the
                    Previewer to check if your eBook converted successfully.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-800 text-xs">
                    EPUB
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600 ">
                    Use any third-party tool available on the internet to create
                    your EPUB file.
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-4 whitespace-nowrap font-medium text-gray-800 text-xs">
                    PDF
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-600 ">
                    Use any third-party tool available on the internet to create
                    your PDF file.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cover Guidelines Section */}
        <div className="relative mb-8">
          <h4 className="text-xl xs:text-2xl font-bold text-gray-800 mb-4 inline-flex items-center">
            <span className="bg-[#EF5353] w-2 h-8 mr-3 rounded-sm inline-block"></span>
            eBook Cover Guidelines
          </h4>

          <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#EF5353] shadow-sm mb-6">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">Marketing Cover Image:</span> Itan
              eBooks must have a marketing cover image provided for use on the
              website detail page. This is provided separately from the eBook
              file. To ensure image clarity on devices, we recommend the
              following specifications:
            </p>
            <ul className="mt-3 ml-5 space-y-2 text-gray-700 list-disc">
              <li>
                <span className="font-medium">Dimensions:</span> 2,560 pixels in
                height x 1,600 pixels in width
              </li>
              <li>
                <span className="font-medium">Resolution:</span> 300 DPI/PPI
                minimum
              </li>
              <li>
                <span className="font-medium">File size:</span> 5MB or fewer
              </li>
              <li>
                <span className="font-medium">Format:</span> JPEG (preferred)
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-blue-600">Note:</span> For
                best quality, particularly on high-definition devices, your
                image should be 2500 pixels in height.
              </p>
            </div>

            <h5 className="text-lg font-semibold text-gray-800 mt-6">
              Important Technical Specifications
            </h5>
            <p className="text-gray-700">
              SVG files are not supported for Itan web and mobile app, and for
              iPad. Your cover should be centered vertically and horizontally on
              the page. The image on your device should be proportional to the
              image in the source (a full-page image should equal a full-screen
              image), plus or minus 15% and center aligned.
            </p>

            <p className="text-gray-700">
              Cover art with white or very light backgrounds can seem to
              disappear against the white background. Try adding a narrow (3-4
              pixel) border in medium gray to define the boundaries of the
              cover. Use RGB as the color profile when saving your cover image
              files. CMYK is not supported.
            </p>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 my-4">
              <p className="text-gray-700">
                <span className="font-semibold text-amber-600">Warning:</span>{" "}
                Covers with less than 500 pixels on the shortest side will not
                be displayed on the website. If the cover image is too small,
                create a new image that meets the size requirements. Do not
                stretch the image, as it may reduce quality.
              </p>
            </div>

            <h5 className="text-lg font-semibold text-gray-800 mt-6">
              Content Restrictions
            </h5>
            <p className="text-gray-700">
              The content of the cover image{" "}
              <span className="font-medium">must not</span>:
            </p>
            <ul className="mt-2 ml-5 space-y-1 text-gray-700 list-disc">
              <li>
                Infringe another publisher's or artist's copyright on the same
                cover
              </li>
              <li>Mention pricing or other temporary promotional offers</li>
            </ul>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#EF5353] mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Before You Publish Checklist
          </h4>

          <ul className="space-y-3">
            {[
              "Ensure that the cover image includes the Title and Author/Contributor information.",
              "Ensure that the cover doesn't include the spine, bar code, back cover or (optional) inside flap.",
              "Check the cover for typos, watermarks, or placeholder/template text.",
              "Make sure any text on your cover does not contradict your IGP detail page (for example, the author name or book title is spelled differently).",
              "Ensure that the cover language matches the language in the book.",
              "Make sure any text is clear, and not blurred, cut-off, or fading into the background.",
              "The internal content cover should include the Title, Sub-title and Author/Contributor information. Check that the internal content cover information matches the information provided on the ITAN detail page and marketing cover image.",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#EF5353] mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>
            For more information on formatting, contact our support team or
            visit the help center.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FormatEbook;
