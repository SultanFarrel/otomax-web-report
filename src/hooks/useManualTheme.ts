import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useManualTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
      }

      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }

    return "light";
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  // Sync ulang class html saat mount atau ketika theme berubah
  useEffect(() => {
    setTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { theme, setTheme };
}
