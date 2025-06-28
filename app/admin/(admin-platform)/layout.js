"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faBook,
  faBookReader,
  faUserEdit,
  faCreditCard,
  faGear,
  faSignOut,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { signOutAdmin } from "@/utils/auth/adminApi"; 
import Image from "next/image";

export default function AuthorDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const pathName = usePathname();
  const router = useRouter();
  const inputRef = useRef(null);



  const isDashboard = pathName.endsWith("/admin/dashboard")
    ? "text-[#E50913]"
    : "text-gray-300";
  const isBooksPage = pathName.endsWith("/admin/books");
  const isBookContent = pathName.endsWith("/books/create/book-content");
  const isBookPricing = pathName.endsWith("/books/create/book-pricing");
  const isSignIn = pathName.endsWith("/author/sign_in");
  const isSignUp = pathName.endsWith("/author/sign_up");
  const isRegPage = isSignIn || isSignUp;

  const textColor =
    isBooksPage || isBookContent || isBookPricing
      ? "text-[#E50913]"
      : "text-gray-300";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="">
      <button onClick={toggleSidebar} className="lg:hidden text-gray-700">
        <FontAwesomeIcon
          icon={isSidebarOpen ? faTimes : faBars}
          size="sm"
          className="right-0 top-0 ml-3 mt-2 p-1 cursor-pointer text-white bg-slate-700 rounded-full"
        />
      </button>

      <div
        className={`lg:flex hidden items-center justify-between ${
          isRegPage ? "hidden" : "fixed top-0 left-0"
        } w-full h-16 py-2 shadow-md z-10 bg-white`}
      >
        <div className="flex-1 relative mr-8">
          <Image
                      width={50}
                      height={50}
                      className="w-12 absolute right-0 -top-6 p-2 rounded-full bg-slate-400 object-cover"
                      alt="Profile"
                      src={
                        `/images/avatar.png`
                      }
                    />
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden"></div>
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-gray-900 text-white transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 sm:block`}
        aria-label="Sidebar"
      >
        <div className="w-full relative">
          <button onClick={toggleSidebar} className="lg:hidden text-gray-700">
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              className="hover:bg-red-100 hover:border-2 w-4 h-4 rounded-full hover:border-red-600 text-red-600 absolute right-3 top-2"
            />
          </button>
        </div>
        <div className="h-full px-4 py-4 overflow-y-auto bg-gray-900 dark:bg-gray-800">
          <Link href="#">
            <img src="/images/logo.png" className="w-16 mb-6 ml-3" />
          </Link>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href={`/admin/dashboard`}
                className="flex items-center p-2 text-[#C5C5C5] rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faThLarge}
                  className={`text-lg group-hover:text-[#E50913] ${isDashboard}`}
                />
                <span
                  className={`ml-2 text-[#C5C5C5] group-hover:text-[#E50913] ${isDashboard}`}
                >
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/admin/books`}
                className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faBook}
                  className={`text-lg group-hover:text-[#E50913] ${textColor}`}
                />
                <span
                  className={`ml-2 text-[#C5C5C5] text-lg group-hover:text-[#E50913] ${textColor}`}
                >
                  Books
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={`/admin/readers`}
                className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faBookReader}
                  className={`text-lg group-hover:text-[#E50913] ${
                    pathName.endsWith("/admin/dashboard/books-not-found")
                      ? "text-[#E50913]"
                      : "text-gray-300"
                  }`}
                />
                <span
                  className={`ml-2 text-[#C5C5C5] group-hover:text-[#E50913] ${
                    pathName.endsWith("/books-not-found")
                      ? "text-[#E50913]"
                      : "text-gray-300"
                  }`}
                >
                  Reader
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/authors"
                className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faUserEdit}
                  className="text-gray-300 text-lg group-hover:text-[#E50913]"
                />
                <span className="ml-2 text-[#C5C5C5] group-hover:text-[#E50913]">
                  Authors
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="payment"
                className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="text-gray-300 text-lg group-hover:text-[#E50913]"
                />
                <span className="ml-2 text-[#C5C5C5] group-hover:text-[#E50913]">
                  Payments
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FontAwesomeIcon
                  icon={faGear}
                  className="text-gray-300 text-lg group-hover:text-[#E50913]"
                />
                <span className="ml-2 text-[#C5C5C5] group-hover:text-[#E50913]">
                  Settings
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      <section>
        <div className="lg:ml-64 lg:mt-20 px-4 lg:px-0 py-6">{children}</div>
      </section>
    </div>
  );
}
