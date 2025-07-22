"use client";

import Link from "next/link";
import React from "react";

type ButtonLinkProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "special" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-[24px] py-[12px] text-xs",
  lg: "px-8 py-4 text-lg",
};

const ButtonLink = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}: ButtonLinkProps) => {
  const baseClasses = `
    uppercase cursor-pointer text-[var(--btn-text)]
    border-4 border-[var(--border-shadow)]
    text-center transition-all duration-100 ease-in-out
    [text-shadow:2px_2px_0_#00000050]
  `;

  const shadowClasses = `
    shadow-[inset_-4px_-4px_0_0_var(--tw-shadow-color)]
    active:shadow-[inset_4px_4px_0_0_var(--tw-shadow-color)]
    active:translate-y-[2px]
  `;

  const variantStyles = {
    primary: `
      bg-[var(--btn-bg)]
      [--tw-shadow-color:var(--btn-shadow)]
      hover:bg-[#66bb6a]
    `,
    secondary: `
      bg-[#0288d1]
      [--tw-shadow-color:#0277bd]
      hover:brightness-110
    `,
    special: `
      bg-[#fdd835]
      text-[#5d4037]
      [--tw-shadow-color:#fbc02d]
      hover:brightness-110
    `,
    danger: `
      bg-[#d32f2f]
      [--tw-shadow-color:#c62828]
      hover:brightness-110
    `,
  };

  const finalClasses = `${sizeClasses[size]} ${baseClasses} ${shadowClasses} ${variantStyles[variant]} ${className}`;

  return (
    <Link href={href} {...props} className={finalClasses}>
      {children}
    </Link>
  );
};

export default ButtonLink;
