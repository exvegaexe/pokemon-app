<template>
  <div class="container my-4">

    <!--logo-->
    <div class="text-center mb-4">
      <img src="../assets/img/logo.png" alt="Pokémon Logo" class="img-fluid" />
    </div>

    <!--search bar-->
    <input v-model="searchQuery" placeholder="Search Pokémon" class="form-control mb-4" />

    <!--loader while waiting for loading-->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!--output pokemon list-->
    <div class="row" v-else>
      <div v-for="pokemon in filteredPokemon" :key="pokemon.name" class="col-md-4 mb-4">
        <div class="card" @click="goToDetails(pokemon)">
          <div class="card-body text-center">
            <img :src="pokemon.sprites.other['official-artwork'].front_default" :alt="pokemon.name" class="img-fluid pokemon-image d-block mx-auto mb-3" />
            <h5 class="card-title mb-2">{{ pokemon.name }}</h5>
            <p class="card-text">
              <span v-for="(type, index) in pokemon.types" :key="type.type.name" class="type-label" :style="{ backgroundColor: typeColors[type.type.name], color: getTextColor(typeColors[type.type.name]) }">
                {{ type.type.name }}
                <span v-if="index < pokemon.types.length - 1"> </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokemonStore } from '../stores/pokemonStore';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const pokemonStore = usePokemonStore();
    const router = useRouter();
    const searchQuery = ref('');

    //define colours for each type
    const typeColors = {
      Normal: "#A8A878",
      Fire: "#F08030",
      Water: "#6890F0",
      Electric: "#F8D030",
      Grass: "#78C850",
      Ice: "#98D8D8",
      Fighting: "#C03028",
      Poison: "#A040A0",
      Ground: "#E0C068",
      Flying: "#A890F0",
      Psychic: "#F85888",
      Bug: "#A8B820",
      Rock: "#B8A038",
      Ghost: "#705898",
      Dragon: "#7038F8",
      Dark: "#705848",
      Steel: "#B8B8D0",
      Fairy: "#EE99AC"
    };

    //dynamic function to make text in type either white or black for readability
    const getTextColor = (backgroundColor) => {
      const hex = backgroundColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "black" : "white";
    };

    onMounted(() => {
      if (!pokemonStore.pokemonList.length) {
        pokemonStore.fetchPokemon();
      }
    });

    //function to filter
    const filteredPokemon = computed(() => {
      return pokemonStore.pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    //function to go to detail page
    const goToDetails = (pokemon) => {
      pokemonStore.selectPokemon(pokemon);
      router.push({ name: 'pokemon-details', params: { name: pokemon.name } });
    };

    return {
      searchQuery,
      filteredPokemon,
      loading: computed(() => pokemonStore.loading),
      goToDetails,
      typeColors,
      getTextColor
    };
  }
};
</script>

<style scoped>
.container {
  background: #f0f8ff; /* Light blue background for the container */
  padding: 20px; /* Add padding inside the container to create space around the content */
  border-radius: 12px; /* Rounded corners for the container */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for a lifted effect */
}

.card {
  background: linear-gradient(135deg, #ffffff, #f9f9f9); /* Gradient background for a subtle effect */
  border-radius: 12px; /* Rounded corners for the card */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Slightly stronger shadow for better separation */
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: scale(1.03); /* Slightly enlarge card on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Enhanced shadow on hover */
}

.pokemon-image {
  border-radius: 12px; /* Rounded corners for the image */
  border: 3px solid #ddd; /* Light border around the image */
}

.type-label {
  display: inline-block;
  padding: 8px 15px;
  border-radius: 12px;
  color: white;
  margin: 3px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  min-width: 90px; /* Adjusted for better readability */
  height: 40px;
  line-height: 24px; /* Adjusted for vertical centering */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
}

h1 {
  color: #000000; /* A vibrant blue for the title */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* Subtle shadow for better readability */
}
</style>