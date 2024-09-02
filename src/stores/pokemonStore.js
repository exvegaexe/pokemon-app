import { defineStore } from 'pinia';

//function to convert text to sentence case
const toSentenceCase = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemonList: [],
    loading: false,
    selectedPokemon: null,
  }),
  actions: {
    async fetchPokemon() {
      this.loading = true;
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await response.json();
        
        //fetch details for each Pokémon
        const pokemonDetailsPromises = data.results.map(async (pokemon) => {
          const detailsResponse = await fetch(pokemon.url);
          const detailsData = await detailsResponse.json();
          return {
            name: toSentenceCase(detailsData.name),
            species: toSentenceCase(detailsData.species.name),
            types: detailsData.types.map(typeInfo => ({
              type: {
                name: toSentenceCase(typeInfo.type.name)
              }
            })),
            sprites: detailsData.sprites,
            abilities: detailsData.abilities.map(abilityInfo => ({
              ability: {
                name: toSentenceCase(abilityInfo.ability.name)
              }
            })),
            height: detailsData.height,
            weight: detailsData.weight
          };
        });
        
        this.pokemonList = await Promise.all(pokemonDetailsPromises);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    selectPokemon(pokemon) {
      this.selectedPokemon = pokemon;
    },
    updatePokemonDetails(updatedPokemon) {
      const index = this.pokemonList.findIndex(p => p.name === updatedPokemon.name);
      if (index !== -1) {
        this.pokemonList[index] = updatedPokemon;
      }
    }
  }
});