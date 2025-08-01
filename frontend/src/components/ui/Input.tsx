import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

export const Input =
  ({ label, error, registration, className, ...props }: InputProps) => {
  const baseClasses = "w-full border-4 bg-[#fffaf0] p-2.5 text-[var(--border-shadow)] border-pixelBorder " +
    "focus:bg-white focus:outline-none"

  return (
    <div className="mb-4">
      <label className="block mb-2 text-lg text-center">{label}</label>
      <input
        {...props}
        {...registration}
        className={`${baseClasses} ${className || ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
