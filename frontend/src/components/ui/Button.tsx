import Link from "next/link";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}

const Button = ({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "py-3 px-6 uppercase cursor-pointer text-white border-4 transition-all duration-100 ease-in-out text-center";

  const shadowClasses =
    "shadow-[inset_-4px_-4px_0_0_var(--tw-shadow-color)] active:shadow-[inset_4px_4px_0_0_var(--tw-shadow-color)] active:translate-y-0.5";

  const variantStyles = {
    primary: [
      "bg-[var(--color-brand-btn)]",
      "border-[var(--color-brand-border-dark)]",
      "[--tw-shadow-color:var(--color-brand-btn-shadow)]",
      "hover:brightness-110",
    ].join(" "),
    secondary: [
      "bg-[var(--color-btn-blue)]",
      "border-[var(--color-brand-border-dark)]",
      "[--tw-shadow-color:var(--color-btn-blue-shadow)]",
      "hover:brightness-110",
    ].join(" "),
  };

  const finalClasses = `${baseClasses} ${shadowClasses} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={finalClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={finalClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
