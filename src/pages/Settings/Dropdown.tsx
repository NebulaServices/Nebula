import { useState, useEffect } from "preact/hooks";
import { FaAngleDown } from "react-icons/fa";

interface Option {
  id: string;
  label: string; // Translations CAN be passed
}

const Dropdown = ({
  name,
  storageKey,
  options,
  refresh
}: {
  name: string;
  storageKey: string;
  options: Option[];
  refresh: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [choice, setChoice] = useState(() => {
    return localStorage.getItem(storageKey) || options[0]?.id || "";
  });

  // update on localstorage change
  useEffect(() => {
    setChoice(localStorage.getItem(storageKey) || options[0]?.id || "");
  }, [storageKey, options]);

  return (
    <div className="relative text-center">
      <h1>{name}</h1>
      <div
        className={`font-roboto flex h-14 w-56 cursor-pointer flex-col items-center justify-center border border-input-border-color bg-input text-center text-xl ${
          isOpen ? "rounded-t-2xl" : "rounded-2xl"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-full w-full select-none flex-row items-center">
          <div class="h-full w-1/4"></div>
          <div class="flex w-2/4 flex-col items-center">
            {options.find((o) => o.id === choice)?.label}
          </div>
          <div class="flex w-1/4 flex-col items-center">
            <FaAngleDown />
          </div>
        </div>
        {isOpen && (
          <div className="absolute top-full w-full">
            {options.map((option, index) => (
              <div
                key={option.id}
                className={`border border-input-border-color bg-input p-2 hover:bg-dropdown-option-hover-color ${
                  index === options.length - 1 ? "rounded-b-2xl" : ""
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setChoice(option.id);
                  localStorage.setItem(storageKey, option.id);
                  if (refresh === true) {
                    window.location.reload();
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;