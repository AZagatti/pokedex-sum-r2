export const typeColors: Record<string, { bg: string; text: string }> = {
	normal: { bg: 'bg-gray-400', text: 'text-gray-900' },
	fire: { bg: 'bg-red-500', text: 'text-white' },
	water: { bg: 'bg-blue-500', text: 'text-white' },
	electric: { bg: 'bg-yellow-400', text: 'text-gray-900' },
	grass: { bg: 'bg-green-500', text: 'text-white' },
	ice: { bg: 'bg-cyan-400', text: 'text-gray-900' },
	fighting: { bg: 'bg-red-700', text: 'text-white' },
	poison: { bg: 'bg-purple-500', text: 'text-white' },
	ground: { bg: 'bg-yellow-700', text: 'text-white' },
	flying: { bg: 'bg-sky-400', text: 'text-gray-900' },
	psychic: { bg: 'bg-pink-500', text: 'text-white' },
	bug: { bg: 'bg-lime-500', text: 'text-gray-900' },
	rock: { bg: 'bg-stone-600', text: 'text-white' },
	ghost: { bg: 'bg-purple-700', text: 'text-white' },
	dragon: { bg: 'bg-indigo-600', text: 'text-white' },
	dark: { bg: 'bg-gray-800', text: 'text-white' },
	steel: { bg: 'bg-slate-400', text: 'text-gray-900' },
	fairy: { bg: 'bg-pink-400', text: 'text-gray-900' }
};

export function getTypeColor(type: string): { bg: string; text: string } {
	return typeColors[type.toLowerCase()] || { bg: 'bg-gray-500', text: 'text-white' };
}

export function capitalizeFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getPokemonNumber(url: string): string {
	const match = url.match(/\/pokemon\/(\d+)\//);
	if (match) {
		return match[1].padStart(4, '0');
	}
	// Fallback: try to parse the URL differently
	const parts = url.split('/').filter(Boolean);
	const numIndex = parts.indexOf('pokemon');
	if (numIndex >= 0 && numIndex + 1 < parts.length) {
		const num = parts[numIndex + 1];
		if (/^\d+$/.test(num)) {
			return num.padStart(4, '0');
		}
	}
	return '0000';
}
