import { useState } from "preact/hooks";
import { FaAngleDown } from "react-icons/fa";
import { useTheme } from "../../components/ThemeProvider";
import { useTranslation } from "react-i18next";

const ThemeDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { theme, setTheme, themes } = useTheme();
  const options = themes.map((theme) => {
    return { id: theme, label: t(`themes.${theme}`) };
  });
  return (
    <div className="relative text-center">
      <div
        className={`font-roboto flex h-14 w-56 cursor-pointer flex-col items-center justify-center border border-input-border-color bg-input text-center text-xl ${
          isOpen ? "rounded-t-2xl" : "rounded-2xl"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-full w-full select-none flex-row items-center">
          <div className="h-full w-1/4"></div>
          <div className="flex w-2/4 flex-row items-center justify-center text-input-text">
            {options.find((o) => o.id === theme)?.label}
          </div>
          <div className="flex w-1/4 flex-col items-center text-input-text">
            <FaAngleDown />
          </div>
        </div>
        {isOpen && (
          <div className="absolute top-full w-full">
            {options.map((option, index) => (
              <div
                key={option.id}
                className={`flex flex-row justify-center border border-input-border-color bg-input p-2 text-input-text hover:bg-dropdown-option-hover-color ${
                  index === options.length - 1 ? "rounded-b-2xl" : ""
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setTheme(option.id);
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

export default ThemeDropdown;
