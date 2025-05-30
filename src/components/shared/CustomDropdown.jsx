import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  isDisabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(
    (option) => option.value === value?.value
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`w-full px-4 py-2 text-left bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
      >
        <div className="flex items-center justify-between">
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1 overflow-auto max-h-60">
            {options.map((option) => (
              <li
                key={option.value || "all"}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                  value?.value === option.value ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
