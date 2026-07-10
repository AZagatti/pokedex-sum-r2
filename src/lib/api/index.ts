import { getCache, setCache } from './cache';
import {
	PokemonResponseSchema,
	PokemonDetailSchema,
	PokemonSpeciesSchema,
	EvolutionChainSchema,
	GenerationSchema,
	TypeSchema,
	BerryResponseSchema,
	BerryDetailSchema,
	type PokemonResponse,
	type PokemonDetail,
	type PokemonSpecies,
	type EvolutionChain,
	type Generation,
	type Type,
	type BerryResponse,
	type BerryDetail
} from './schemas';

const BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchJson(url: string) {
	const cached = getCache(url);
	if (cached) return cached;

	const res = await fetch(url);
	if (!res.ok) throw new Error(`API error: ${res.status}`);

	const data = await res.json();
	setCache(url, data);
	return data;
}

export async function getPokemonList(limit: number, offset: number): Promise<PokemonResponse> {
	const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
	const data = await fetchJson(url);
	return PokemonResponseSchema.parse(data);
}

export async function getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
	const url = `${BASE_URL}/pokemon/${nameOrId}`;
	const data = await fetchJson(url);
	return PokemonDetailSchema.parse(data);
}

export async function getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
	const url = `${BASE_URL}/pokemon-species/${nameOrId}`;
	const data = await fetchJson(url);
	return PokemonSpeciesSchema.parse(data);
}

export async function getEvolutionChain(id: number): Promise<EvolutionChain> {
	const url = `${BASE_URL}/evolution-chain/${id}`;
	const data = await fetchJson(url);
	return EvolutionChainSchema.parse(data);
}

export async function getGeneration(id: number): Promise<Generation> {
	const url = `${BASE_URL}/generation/${id}`;
	const data = await fetchJson(url);
	return GenerationSchema.parse(data);
}

export async function getType(name: string): Promise<Type> {
	const url = `${BASE_URL}/type/${name}`;
	const data = await fetchJson(url);
	return TypeSchema.parse(data);
}

export async function getBerryList(limit: number, offset: number): Promise<BerryResponse> {
	const url = `${BASE_URL}/berry?limit=${limit}&offset=${offset}`;
	const data = await fetchJson(url);
	return BerryResponseSchema.parse(data);
}

export async function getBerryDetail(nameOrId: string | number): Promise<BerryDetail> {
	const url = `${BASE_URL}/berry/${nameOrId}`;
	const data = await fetchJson(url);
	return BerryDetailSchema.parse(data);
}

export async function fetchPokemonList(limit: number, offset: number): Promise<PokemonResponse | null> {
	try {
		return await getPokemonList(limit, offset);
	} catch {
		return null;
	}
}

export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonDetail | null> {
	try {
		return await getPokemonDetail(nameOrId);
	} catch {
		return null;
	}
}

export async function fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies | null> {
	try {
		return await getPokemonSpecies(nameOrId);
	} catch {
		return null;
	}
}

export async function fetchEvolutionChain(id: number | string): Promise<EvolutionChain | null> {
	try {
		return await getEvolutionChain(Number(id));
	} catch {
		return null;
	}
}

export async function fetchBerryList(limit: number = 50, offset: number = 0): Promise<BerryResponse | null> {
	try {
		return await getBerryList(limit, offset);
	} catch {
		return null;
	}
}

export async function fetchBerryDetail(nameOrId: string | number): Promise<BerryDetail | null> {
	try {
		return await getBerryDetail(nameOrId);
	} catch {
		return null;
	}
}
