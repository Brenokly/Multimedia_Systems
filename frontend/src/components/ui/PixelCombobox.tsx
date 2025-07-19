"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";

type ComboboxItem = {
  id: string;
  label: string;
};

type PixelComboboxProps = {
  items: ComboboxItem[];
  value: ComboboxItem;
  onChange: (value: ComboboxItem) => void;
  className?: string;
};

export const PixelCombobox = ({
  items,
  value,
  onChange,
  className,
}: PixelComboboxProps) => {
  return (
    <Combobox
      as="div"
      className={`relative ${className}`}
      value={value}
      onChange={onChange}
    >
      <ComboboxButton className="relative w-full cursor-pointer border-4 border-[var(--border-shadow)] bg-[#fffaf0] py-2.5 pl-3 pr-10 text-left text-sm text-[var(--text-color)] focus:outline-none">
        <span className="block font-pixel uppercase">{value.label}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8">
            <path fill="#5d4037" d="M0 0h12L6 8z" />
          </svg>
        </span>
      </ComboboxButton>

      {/* A lista de opções que aparece/desaparece com transição */}
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto border-4 border-[var(--border-shadow)] bg-[var(--bg-color)] py-1 text-base shadow-lg focus:outline-none sm:text-sm">
          {items.map((item) => (
            <ComboboxOption
              key={item.id}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-4 pr-4 font-pixel uppercase text-xs ${
                  active
                    ? "bg-[var(--btn-bg)] text-[var(--btn-text)]"
                    : "text-[var(--text-color)]"
                }`
              }
              value={item}
            >
              {item.label}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Transition>
    </Combobox>
  );
};
