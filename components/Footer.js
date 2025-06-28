import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bricolage_Grotesque } from "next/font/google";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faFacebookF,
  faLinkedinIn,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

const Footer = ({ styles }) => {
  const pathname = usePathname();
  const authorPages =
    pathname.startsWith("/author") || pathname.startsWith("/dashboard");

  return (
    <footer
      className={`${styles} bg-[#111928]`}
    >
      <section className="relative z-30 h-[150px] xs:h-[170px] medium:h-[200px] large:h-[220px] xl:h-[250px] flex flex-col items-center justify-center text-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/footer-bg-img.jpeg')" }}
        ></div>

        {/* Full-screen backdrop to reduce image sharpness */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 w-full px-4 text-gray-200 mb-1  medium:mb-3">
          <h2 className="mx-auto text-center text-2xl sm:text-4xl  mb-4 md:mb-6 font-semibold">
            Stay In The Know
          </h2>
          <p className="mx-auto text-center text-sm sm:text-xl md:mb-2">
            Subscribe for IGP updates and special offers.
          </p>
        </div>

        <div className="relative z-10 flex justify-center w-[90%] xs:w-[85%] medium:w-[70%] large:w-[60%] xl:w-[50%] p-1 bg-white backdrop-blur-md rounded-md">
          <input
            type="email"
            placeholder="Enter email address"
            className="w-10 flex-1 border-0 outline-none ring-0 focus:ring-0 text-xs xs:text-sm medium:text-base px-2"
          />
          <button className="text-gray-200 bg-[#E50913] border border-black px-3 xs:px-4 medium:px-6 py-1.5 medium:py-2 text-xs xs:text-sm medium:text-base rounded-md cursor-pointer">
            Subscribe
          </button>
        </div>
      </section>

      <section className="bg-[#111928] md:mx-5">
        <div className="flex items-center ml-8 mb-3 pt-3">
          <Link href="/">
            <Image
              src="/images/logo.png"
              width={60}
              height={20}
              alt="itan logo"
              className="lg:w-12 -ml-4 lg:-mb-2"
            />
          </Link>
          {/* <p
            className={`${bricolage.className} text-gray-200 text-[21px] md:text-[24px] lg:text-3xl font-bold -mb-1 lg:-mb-3 -ml-3`}
          >
            Global Publishing
          </p> */}
        </div>

        {/* About Itan */}
        <div className="sm:flex justify-between lg:max-w-[1200px]">
          <div className="text-gray-200 text-xs max-w-[600px] lg:max-w-[700px] mx-4 mr-10 lg:text-sm">
            <p className="mb-2 ">
              ITAN Global Publishing (IGP) is a digital self-publishing and
              aggregator that connects African literature to new audiences
              across the globe, creating a vibrant market for African
              narratives. We are focused on empowering writers, authors,
              storytellers, and publishers from underrepresented African
              nations.
            </p>

            <p>
              Our vision is to bring African stories to the global market in
              ways that make them accessible, and engaging. <br />
              By leveraging technology, we are redefining modern{" "}
              <br className="lg:hidden" />
              publishing—offering services that include manuscript formatting,
              digital publishing, strategic marketing, and seamless
              distribution.
            </p>
          </div>

          <div className="text-[13px] sm:grid grid-cols-2 gap-x-3 lg:gap-x-10 hidden h-28 text-gray-400 min-w-[250px]">
            <Link
              href="https://itanglobalpublishing.substack.com/"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Author Resources
            </Link>
            <Link
              href="https://itanglobalpublishing.substack.com/"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Blog
            </Link>
            <Link
              href="mailto:support@itan.app"
              target="_blank"
              aria-label="Contact support via email"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Help Center
            </Link>
            <Link
              href="#"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Content Policy
            </Link>
            <Link
              href="https://www.youtube.com/@itanIGP"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Youtube
            </Link>
            <Link
              href="#"
              target="_blank"
              className="cursor-pointer hover:text-[#EF5353]"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center text-gray-200 mt-4">
          {/* Social icons */}
          <div className="flex items-center justify-center sm:justify-start sm:ml-9 w-full">
            <div className="flex space-x-2">
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353]"
                />
              </Link>
              <Link
                href="https://x.com/ItanGlobal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faXTwitter}
                  className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353]"
                />
              </Link>
              <Link
                href="https://web.facebook.com/itanglobalpublishing/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faFacebookF}
                  className="w-[15px] h-5 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353]"
                />
              </Link>
              <Link
                href="https://www.instagram.com/itanglobalpublishing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="w-[15px] h-3 p-2 rounded-full border-2 border-[#EF5353] hover:bg-[#EF5353] hover:scale-110 transition-all duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Placeholder content */}
          <div className=" flex flex-col items-center mt-3 text-[12px] text-gray-400">
            <div className="flex flex-col items-center sm:hidden space-y-3">
              <Link
                href="https://itanglobalpublishing.substack.com/"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Author Resources
              </Link>
              <Link
                href="mailto:support@itan.app"
                target="_blank"
                aria-label="Contact support via email"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Help Center
              </Link>
              <Link
                href="https://www.youtube.com/@itanIGP"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Youtube
              </Link>
              <Link
                href="https://itanglobalpublishing.substack.com/"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Blog
              </Link>
              <Link
                href="#"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Contact
              </Link>
              <Link
                href="#"
                target="_blank"
                className="cursor-pointer hover:text-[#EF5353]"
              >
                Content Policy
              </Link>
            </div>
            <div className="mt-6">
              <Link
                className="mr-4 hover:text-[#EF5353] cursor-pointer"
                href="/terms&conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </Link>
              <Link
                className="hover:text-[#EF5353] cursor-pointer"
                href="/privacy-policies"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mx-4 xs:mx-5 medium:mx-10 large:mx-16 xl:mx-20 mt-4 medium:mt-5 large:mt-6">
          <span className="block h-[2px] w-full bg-[#EF5353]/30"></span>
        </div>

        {/* Copyright */}
        <div className="text-gray-200 flex justify-center mx-4 xs:mx-5 medium:mx-10 large:mx-16 xl:mx-20 mt-3 pb-6 medium:pb-8 large:pb-10 text-sm md:text-base">
          <p style={{ fontFamily: "Lato, sans-serif" }}>
            ITAN Technologies Ltd. &copy; 2025. All Rights Reserved
          </p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
