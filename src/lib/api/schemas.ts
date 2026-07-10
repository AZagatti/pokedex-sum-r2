import { z } from 'zod';

export const PokemonResponseSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(
		z.object({
			name: z.string(),
			url: z.string()
		})
	)
});

export const PokemonDetailSchema = z.object({
	id: z.number(),
	name: z.string(),
	height: z.number(),
	weight: z.number(),
	sprites: z.object({
		front_default: z.string().nullable(),
		back_default: z.string().nullable(),
		front_shiny: z.string().nullable(),
		back_shiny: z.string().nullable(),
		other: z.object({
			'official-artwork': z.object({
				front_default: z.string().nullable()
			}).optional()
		}).optional()
	}),
	types: z.array(
		z.object({
			type: z.object({
				name: z.string(),
				url: z.string()
			})
		})
	),
	abilities: z.array(
		z.object({
			ability: z.object({
				name: z.string(),
				url: z.string()
			}),
			is_hidden: z.boolean()
		})
	),
	stats: z.array(
		z.object({
			base_stat: z.number(),
			effort: z.number(),
			stat: z.object({
				name: z.string()
			})
		})
	),
	moves: z.array(
		z.object({
			move: z.object({
				name: z.string(),
				url: z.string()
			})
		})
	).optional(),
	species: z.object({
		name: z.string(),
		url: z.string()
	}).optional(),
	cries: z.object({
		latest: z.string().nullable().optional(),
		legacy: z.string().nullable().optional()
	}).optional()
});

export const PokemonSpeciesSchema = z.object({
	id: z.number(),
	evolution_chain: z.object({
		url: z.string()
	}),
	generation: z.object({
		name: z.string(),
		url: z.string()
	})
});

export const EvolutionChainSchema = z.object({
	id: z.number(),
	chain: z.object({
		species: z.object({
			name: z.string(),
			url: z.string()
		}),
		evolves_to: z.array(z.any()).default([])
	})
});

export const GenerationSchema = z.object({
	id: z.number(),
	name: z.string(),
	pokemon_species: z.array(
		z.object({
			name: z.string(),
			url: z.string()
		})
	)
});

export const TypeSchema = z.object({
	id: z.number(),
	name: z.string(),
	pokemon: z.array(
		z.object({
			pokemon: z.object({
				name: z.string(),
				url: z.string()
			})
		})
	)
});

export const BerryResponseSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(
		z.object({
			name: z.string(),
			url: z.string()
		})
	)
});

export const BerryDetailSchema = z.object({
	id: z.number(),
	name: z.string(),
	firmness: z.object({
		name: z.string()
	}),
	flavors: z.array(
		z.object({
			flavor: z.object({
				name: z.string()
			}),
			potency: z.number()
		})
	),
	growth_time: z.number(),
	size: z.number()
});

export type PokemonResponse = z.infer<typeof PokemonResponseSchema>;
export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type Generation = z.infer<typeof GenerationSchema>;
export type Type = z.infer<typeof TypeSchema>;
export type BerryResponse = z.infer<typeof BerryResponseSchema>;
export type BerryDetail = z.infer<typeof BerryDetailSchema>;
