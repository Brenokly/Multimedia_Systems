"use client";

import Link from "next/link";
import React from "react";

// A tipagem herda os atributos de um link (<a>) e exige 'href'.
type ButtonLinkProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

const ButtonLink = ({
  children,
  variant = "primary",
  className = "",
  href,
  ...props
}: ButtonLinkProps) => {
  const baseClasses =
    "py-3 px-6 uppercase cursor-pointer text-white border-4 border-[var(--color-brand-border-dark)] transition-all duration-100 ease-in-out text-center";

  const shadowClasses =
    "shadow-[inset_-4px_-4px_0_0_var(--tw-shadow-color)] active:shadow-[inset_4px_4px_0_0_var(--tw-shadow-color)] active:translate-y-0.5";

  const variantStyles = {
    primary: [
      "bg-[var(--color-brand-btn)]",
      "[--tw-shadow-color:var(--color-brand-btn-shadow)]",
      "hover:brightness-110",
    ].join(" "),
    secondary: [
      "bg-[var(--color-btn-blue)]",
      "[--tw-shadow-color:var(--color-btn-blue-shadow)]",
      "hover:brightness-110",
    ].join(" "),
  };

  const finalClasses = `${baseClasses} ${shadowClasses} ${variantStyles[variant]} ${className}`;

  // O componente renderiza apenas um Link, sem lógica de botão.
  return (
    <Link href={href} className={finalClasses} {...props}>
      {children}
    </Link>
  );
};

export default ButtonLink;
