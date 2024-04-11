import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
export type Theme =
  | "main"
  | "hacker"
  | "catppuccin-mocha"
  | "catppuccin-macchiato"
  | "catppuccin-frappe"
  | "catppuccin-latte";
export const themes: Theme[] = [
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
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  themes: themes,
  theme: "main",
  setTheme: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const defaultTheme = "main";
  const storageKey = "theme";
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    themes.forEach((theme) => {
      root.classList.remove(theme);
    });

    root.classList.add(theme);
  }, [theme, themes]);

  const value = {
    theme,
    themes,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
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
