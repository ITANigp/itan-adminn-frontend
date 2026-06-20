// export const metadata = {
// //   title: {
// //     default: "IGP"
// //   },
//   icons: {
//     icon: "/images/itan-favicon.png",
//   },
// };

"use client";

// import RootLayout from "./RootLayout";
import { Toaster } from "react-hot-toast";
import "flowbite";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Toaster  />
        {children}
      </body>
    </html>
  );
}
