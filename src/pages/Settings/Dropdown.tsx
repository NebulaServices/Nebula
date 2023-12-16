import { useState } from "preact/hooks";

const Dropdown = ({ name, options }: { name: string; options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [choice, setChoice] = useState(
    localStorage.getItem(name) || options[0]
  );

  return (
    <div className="relative text-center">
      <h1>{name}</h1>
      <div
        className="font-roboto flex h-14 w-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-input-border-color bg-input text-center text-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="select-none">{choice}</div>
        {isOpen && (
          <div className="absolute top-full w-full border">
            {options.map((option: string) => (
              <div
                key={option}
                className="hover:bg-dropdown-option-hover-color"
                onClick={() => {
                  setIsOpen(false);
                  setChoice(option);
                  localStorage.setItem(name, option);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;

