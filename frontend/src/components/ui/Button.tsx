"use client";

import React from "react";

// A tipagem agora é simples e herda diretamente os atributos de um botão HTML.
type ButtonProps = {
  children: React.ReactNode;
  variant?: "green" | "blue" | "yellow" | "red";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  variant = "green",
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "py-3 px-6 uppercase cursor-pointer hover:brightness-110 border-4 border-[var(--color-brand-border-dark)] transition-all duration-100 ease-in-out text-center";

  const shadowClasses =
    "shadow-[inset_-4px_-4px_0_0_var(--tw-shadow-color)] active:shadow-[inset_4px_4px_0_0_var(--tw-shadow-color)] active:translate-y-0.5";

  const variantStyles = {
    green: [
      "bg-[var(--color-brand-btn)]",
      "[--tw-shadow-color:var(--color-brand-btn-shadow)]",
      "text-white",
    ].join(" "),
    blue: [
      "bg-[var(--color-btn-blue)]",
      "[--tw-shadow-color:var(--color-btn-blue-shadow)]",
      "text-white",
    ].join(" "),
    yellow: [
      "bg-[var(--color-yellow-primary)]",
      "[--tw-shadow-color:var(--color-yellow-shadow)]",
      "text-[var(--color-brand-border-dark)]",
    ].join(" "),
    red: [
      "bg-red-500",
      "[--tw-shadow-color:theme(colors.red.700)]",
      "text-white",
    ].join(" "),
  };

  const finalClasses = `${baseClasses} ${shadowClasses} ${variantStyles[variant]} ${className}`;

  // O componente agora renderiza apenas um botão, sem lógica de link.
  return (
    <button className={finalClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
