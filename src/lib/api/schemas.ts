import { z } from "zod";

export const PokemonResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
});

export const PokemonDetailSchema = z.object({
  abilities: z.array(
    z.object({
      ability: z.object({
        name: z.string(),
        url: z.string(),
      }),
      is_hidden: z.boolean(),
    })
  ),
  cries: z
    .object({
      latest: z.string().nullable().optional(),
      legacy: z.string().nullable().optional(),
    })
    .optional(),
  height: z.number(),
  id: z.number(),
  moves: z
    .array(
      z.object({
        move: z.object({
          name: z.string(),
          url: z.string(),
        }),
      })
    )
    .optional(),
  name: z.string(),
  species: z
    .object({
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  sprites: z.object({
    back_default: z.string().nullable(),
    back_shiny: z.string().nullable(),
    front_default: z.string().nullable(),
    front_shiny: z.string().nullable(),
    other: z
      .object({
        "official-artwork": z
          .object({
            front_default: z.string().nullable(),
          })
          .optional(),
      })
      .optional(),
  }),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: z.object({
        name: z.string(),
      }),
    })
  ),
  types: z.array(
    z.object({
      type: z.object({
        name: z.string(),
        url: z.string(),
      }),
    })
  ),
  weight: z.number(),
});

export const PokemonSpeciesSchema = z.object({
  evolution_chain: z.object({
    url: z.string(),
  }),
  generation: z.object({
    name: z.string(),
    url: z.string(),
  }),
  id: z.number(),
});

export const EvolutionChainSchema = z.object({
  chain: z.object({
    evolves_to: z.array(z.any()).default([]),
    species: z.object({
      name: z.string(),
      url: z.string(),
    }),
  }),
  id: z.number(),
});

export const GenerationSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_species: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
});

export const TypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({
      pokemon: z.object({
        name: z.string(),
        url: z.string(),
      }),
    })
  ),
});

export const BerryResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
});

export const BerryDetailSchema = z.object({
  firmness: z.object({
    name: z.string(),
  }),
  flavors: z.array(
    z.object({
      flavor: z.object({
        name: z.string(),
      }),
      potency: z.number(),
    })
  ),
  growth_time: z.number(),
  id: z.number(),
  name: z.string(),
  size: z.number(),
});

export type PokemonResponse = z.infer<typeof PokemonResponseSchema>;
export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type Generation = z.infer<typeof GenerationSchema>;
export type Type = z.infer<typeof TypeSchema>;
export type BerryResponse = z.infer<typeof BerryResponseSchema>;
export type BerryDetail = z.infer<typeof BerryDetailSchema>;
