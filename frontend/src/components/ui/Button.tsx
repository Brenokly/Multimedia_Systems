"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "special" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "uppercase cursor-pointer text-[var(--btn-text)] border-4 border-[var(--border-shadow)] text-center transition-all duration-100 ease-in-out text-shadow-custom";

  const shadowClasses =
    "shadow-[inset_-4px_-4px_0_0_var(--tw-shadow-color)] active:shadow-[inset_4px_4px_0_0_var(--tw-shadow-color)] active:translate-y-[2px]";

  const variantStyles = {
    primary:
      "bg-[var(--btn-bg)] [--tw-shadow-color:var(--btn-shadow)] hover:bg-[#66bb6a]",
    secondary: "bg-[#0288d1] [--tw-shadow-color:#0277bd] hover:brightness-110",
    special:
      "bg-[var(--color-yellow-primary)] text-[var(--text-color)] [--tw-shadow-color:var(--color-yellow-shadow)] hover:brightness-110",
    danger:
      "bg-[var(--color-brand-red)] [--tw-shadow-color:var(--color-brand-red-shadow)] hover:brightness-110",
  };

  const finalClasses = `${sizeClasses[size]} ${baseClasses} ${shadowClasses} ${variantStyles[variant]} ${className}`;

  return (
    <button className={finalClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
