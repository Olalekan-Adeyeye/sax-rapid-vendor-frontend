"use client";
import { ChevronDown, Search } from "lucide-react";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FormField } from "./FormField";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  hideAsterisk?: boolean;
  options: { label: string; value: string | number; disabled?: boolean }[];
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  outerClassName?: string;
  optionClassName?: string;
  searchInputClassName?: string;
  ref?: React.Ref<HTMLSelectElement>;
  searchable?: boolean;
}

function SearchableSelect({
  label,
  id,
  required,
  error,
  helpText,
  hideAsterisk,
  options,
  leftSlot,
  rightSlot,
  className = "",
  outerClassName = "",
  optionClassName = "",
  searchInputClassName = "",
  value,
  onChange,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (opt) => opt.value.toString() === value?.toString(),
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, search]);

  const openDropdown = useCallback(() => {
    setSearch("");
    setActiveIndex(-1);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const updateCoords = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateCoords();
    const onScroll = () => updateCoords();
    const onResize = () => updateCoords();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, updateCoords]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const selectOption = useCallback(
    (opt: { label: string; value: string | number }) => {
      if (onChange) {
        const syntheticEvent = {
          target: { value: opt.value.toString(), name: props.name },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
      setIsOpen(false);
    },
    [onChange, props.name],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          openDropdown();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filteredOptions[activeIndex]) {
            selectOption(filteredOptions[activeIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, activeIndex, filteredOptions, selectOption, openDropdown],
  );

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <FormField
      label={label}
      id={id}
      required={required}
      error={error}
      helpText={helpText}
      hideAsterisk={hideAsterisk}
      className={outerClassName}
    >
      <div className="relative group">
        {leftSlot && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10 transition-colors group-focus-within:text-gold">
            {leftSlot}
          </div>
        )}
        <div
          ref={triggerRef}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          tabIndex={0}
          onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
          onKeyDown={handleKeyDown}
          className={`w-full bg-white border ${
            isOpen ? "border-gold" : "border-gray-300"
          } focus:border-gold text-sm font-medium rounded ${
            leftSlot ? "pl-12" : "px-5"
          } pr-12 py-3.5 outline-none transition-all cursor-pointer flex items-center ${className} ${
            !selectedOption ? "text-gray-400" : "text-black"
          }`}
        >
          <span className="truncate flex-1">
            {selectedOption?.label || "Select an option"}
          </span>
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 pointer-events-none">
          {rightSlot}
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? "rotate-180" : ""} ${
              rightSlot ? "text-gray-300" : ""
            }`}
          />
        </div>

        {isOpen &&
          coords &&
          createPortal(
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    position: "fixed",
                    top: coords.top,
                    left: coords.left,
                    width: coords.width,
                    zIndex: 99999,
                  }}
                  className="bg-white border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded overflow-hidden"
                >
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        ref={searchRef}
                        type="text"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setActiveIndex(-1);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type to search..."
                        className={`${searchInputClassName} w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-gold/50`}
                      />
                    </div>
                  </div>
                  <div
                    id={`${id}-listbox`}
                    ref={listRef}
                    role="listbox"
                    className="max-h-60 overflow-y-auto overscroll-contain"
                  >
                    {filteredOptions.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs font-medium text-gray-400">
                        No options found
                      </div>
                    ) : (
                      filteredOptions.map((opt, idx) => {
                        const isSelected =
                          opt.value.toString() === value?.toString();
                        return (
                          <div
                            key={opt.value}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => !opt.disabled && selectOption(opt)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`${optionClassName} px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                              opt.disabled
                                ? "opacity-40 cursor-not-allowed"
                                : idx === activeIndex
                                  ? "bg-gold/5 text-gold"
                                  : isSelected
                                    ? "bg-gold/10 text-gold font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span className="truncate">{opt.label}</span>
                            {isSelected && (
                              <span className="text-gold text-xs">
                                &#10003;
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )}
      </div>
    </FormField>
  );
}

export function Select({ searchable = false, ...rest }: SelectProps) {
  if (searchable) {
    return <SearchableSelect {...rest} />;
  }

  const {
    label,
    id,
    required,
    error,
    helpText,
    hideAsterisk,
    options,
    leftSlot,
    rightSlot,
    className = "",
    outerClassName = "",
    ref,
    ...props
  } = rest;

  return (
    <FormField
      label={label}
      id={id}
      required={required}
      error={error}
      helpText={helpText}
      hideAsterisk={hideAsterisk}
      className={outerClassName}
    >
      <div className="relative group">
        {leftSlot && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10 transition-colors group-focus-within:text-gold">
            {leftSlot}
          </div>
        )}
        <select
          id={id}
          ref={ref}
          required={required}
          className={`w-full bg-white border border-gray-300 focus:border-gold text-black text-sm font-medium rounded ${
            leftSlot ? "pl-12" : "px-5"
          } pr-12 py-3.5 appearance-none outline-none transition-all cursor-pointer ${className}`}
          {...props}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className={`bg-white text-black`}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
          {rightSlot}
          <ChevronDown size={14} className={rightSlot ? "text-gray-300" : ""} />
        </div>
      </div>
    </FormField>
  );
}
