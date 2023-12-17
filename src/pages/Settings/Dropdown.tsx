import { useState, useEffect } from "preact/hooks";

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
        className="font-roboto flex h-14 w-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-input-border-color bg-input text-center text-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="select-none">
          {options.find((o) => o.id === choice)?.label}
        </div>
        {isOpen && (
          <div className="absolute top-full w-full border">
            {options.map((option) => (
              <div
                key={option.id}
                className="hover:bg-dropdown-option-hover-color"
                onClick={() => {
                  setIsOpen(false);
                  setChoice(option.id);
                  localStorage.setItem(storageKey, option.id);
                  if (refresh == true) {
                    window.location.reload()
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
