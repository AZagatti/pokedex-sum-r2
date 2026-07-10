import { writable } from "svelte/store";

export type Theme = "light" | "dark";

function createThemeStore() {
  let initialTheme: Theme = "light";

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      initialTheme = stored;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initialTheme = "dark";
    }
  }

  const { subscribe, set } = writable<Theme>(initialTheme);

  return {
    set(theme: Theme) {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
      }
      set(theme);
    },
    subscribe,
    toggle() {
      this.set((current: Theme) => (current === "light" ? "dark" : "light"));
    },
  };
}

export const themeStore = createThemeStore();
