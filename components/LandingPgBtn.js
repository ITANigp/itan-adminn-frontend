"use client";
import React from "react";

const LandingPgBtn = ({
  children,
  variant = "outlined",
  className = "",
  ...props
}) => {
  const baseStyles =
    "rounded-md font-semibold transition-colors duration-200 text-center whitespace-nowrap";

  // Wider buttons to prevent text wrapping on "Create Account"
  const sizeStyles =
    "w-auto px-4 py-1 text-sm medium:px-5 medium:py-1.5 medium:text-sm large:px-6 large:py-1.5 large:text-base xl:px-7 xl:py-2 xl:text-base";

  const variants = {
    outlined:
      "text-white border border-red-500 border-solid hover:bg-red-500/10",
    filled: "text-white bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default LandingPgBtn;
