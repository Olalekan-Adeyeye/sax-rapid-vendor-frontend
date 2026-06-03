"use client";

import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  useCallback,
  useSyncExternalStore,
  useLayoutEffect,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface DropdownContextValue {
  close: () => void;
}
const DropdownContext = createContext<DropdownContextValue>({
  close: () => {},
});

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const GAP = 6;
const EDGE_MARGIN = 4;

function useDropdownPosition(
  triggerRef: React.RefObject<HTMLElement | null>,
  menuRef: React.RefObject<HTMLElement | null>,
  align: "left" | "right",
  isOpen: boolean,
) {
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    isFlipped: false,
    originX: 0,
    originY: 0,
  });

  const updateCoords = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const menuW = menu.offsetWidth;
    const menuH = menu.offsetHeight;

    // --- Vertical ---
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;
    const fitsBelow = spaceBelow >= menuH + GAP;
    const fitsAbove = spaceAbove >= menuH + GAP;
    const isFlipped = !fitsBelow && fitsAbove;

    let top: number;
    if (isFlipped) {
      top = rect.top - menuH - GAP;
      if (top < EDGE_MARGIN) top = EDGE_MARGIN;
    } else {
      top = rect.bottom + GAP;
      if (top + menuH > vh - EDGE_MARGIN) {
        top = vh - menuH - EDGE_MARGIN;
      }
    }

    // --- Horizontal ---
    let left: number;
    if (align === "right") {
      left = rect.right - menuW;
    } else {
      left = rect.left;
    }
    if (left + menuW > vw - EDGE_MARGIN) {
      left = vw - menuW - EDGE_MARGIN;
    }
    if (left < EDGE_MARGIN) {
      left = EDGE_MARGIN;
    }

    const originX = align === "right" ? 100 : 0;
    const originY = isFlipped ? 100 : 0;

    setCoords({ top, left, isFlipped, originX, originY });
  }, [triggerRef, menuRef, align]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const frameId = requestAnimationFrame(() => updateCoords());
    const handler = () => updateCoords();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [isOpen, updateCoords]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!isOpen || !menu) return;
    const ro = new ResizeObserver(() => updateCoords());
    ro.observe(menu);
    return () => ro.disconnect();
  }, [isOpen, menuRef, updateCoords]);

  return coords;
}

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useIsClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { top, left, isFlipped, originX, originY } = useDropdownPosition(
    dropdownRef,
    menuRef,
    align,
    isOpen,
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={toggle} className="flex items-center">
        {trigger}
      </div>

      {isClient &&
        createPortal(
          <DropdownContext.Provider value={{ close: () => setIsOpen(false) }}>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: isFlipped ? 8 : -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: isFlipped ? 8 : -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{
                    position: "fixed",
                    top,
                    left,
                    transformOrigin: `${originX}% ${originY}%`,
                  }}
                  className="z-99999 min-w-48 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm"
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </DropdownContext.Provider>,
          document.body,
        )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  icon?: ReactNode;
  variant?: "default" | "danger" | "warning";
  className?: string;
  disabled?: boolean;
}

const VARIANT_STYLES = {
  default: "text-gray-600 hover:bg-gray-50 hover:text-black",
  danger: "text-red-500 hover:bg-red-50 hover:text-red-600",
  warning: "text-gold hover:bg-gold/10 hover:text-gold-600",
};

export function DropdownItem({
  children,
  onClick,
  icon,
  variant = "default",
  className = "",
  disabled = false,
}: DropdownItemProps) {
  const { close } = useContext(DropdownContext);

	const handleClick = (e: React.MouseEvent) => {
		if (disabled) return;
		onClick?.(e);
		setTimeout(() => close(), 0);
	};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      close();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
      className={`w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors text-left outline-none ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : `${VARIANT_STYLES[variant]} cursor-pointer`
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </div>
  );
}

export function DropdownDivider() {
  return <div className="h-px bg-gray-50 my-1" />;
}
