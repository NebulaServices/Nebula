import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
type Theme =
  | "main"
  | "hacker"
  | "catppuccin-mocha"
  | "catppuccin-macchiato"
  | "catppuccin-frappe"
  | "catppuccin-latte";
const themes: Theme[] = [
  "main",
  "hacker",
  "catppuccin-mocha",
  "catppuccin-macchiato",
  "catppuccin-frappe",
  "catppuccin-latte"
];
type ThemeProviderProps = {
  children: React.ReactNode;
};
type ThemeProviderState = {
  themes: Theme[];
  theme: Theme;
  background: string;
  setTheme: (theme: Theme) => void;
  setBackground: (background: string) => void;
};

const initialState: ThemeProviderState = {
  themes: themes,
  theme: "main",
  background: "",
  setTheme: () => null,
  setBackground: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const defaultTheme = "main";
  const storageKey = "theme";
  const bgKey = "background";
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [background, setBackground] = useState<string>(() =>
    localStorage.getItem(bgKey)
  );

  useEffect(() => {
    const root = window.document.documentElement;

    themes.forEach((theme) => {
      root.classList.remove(theme);
    });
    root.classList.add(theme);
    if (background) {
      document.documentElement.style.setProperty(
        "--background-image",
        `url(${background})`
      );
    }
  }, [theme, themes, background]);

  const value = {
    theme,
    themes,
    background,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setBackground: (background: string) => {
      localStorage.setItem(bgKey, background);
      setBackground(background);
    }
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
