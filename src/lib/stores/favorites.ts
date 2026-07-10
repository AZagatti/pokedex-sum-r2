import { writable } from "svelte/store";

function createFavoritesStore() {
  let favorites = new Set<string>();

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        favorites = new Set(JSON.parse(stored));
      } catch {
        favorites = new Set();
      }
    }
  }

  const { subscribe, set } = writable<Set<string>>(favorites);

  function save(fav: Set<string>) {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(Array.from(fav)));
    }
    set(fav);
  }

  return {
    add(name: string) {
      favorites.add(name);
      save(new Set(favorites));
    },
    isFavorite(name: string): boolean {
      return favorites.has(name);
    },
    remove(name: string) {
      favorites.delete(name);
      save(new Set(favorites));
    },
    subscribe,
    toggle(name: string) {
      if (favorites.has(name)) {
        this.remove(name);
      } else {
        this.add(name);
      }
    },
  };
}

export const favoritesStore = createFavoritesStore();
