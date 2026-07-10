const cache = new Map<string, unknown>();

export function getCache<T>(key: string): T | undefined {
	return cache.get(key) as T | undefined;
}

export function setCache<T>(key: string, value: T): void {
	cache.set(key, value);
}

export function clearCache(): void {
	cache.clear();
}
