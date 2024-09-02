<template>
  <div v-if="pokemon" :key="pokemon.name">
    <div class="container my-4">
      <div class="row justify-content-center align-items-center" style="min-height: 75vh">
        <!-- left column for image -->
        <div class="col-md-4 text-center">
          <img
            :src="pokemon.sprites.other['official-artwork'].front_default"
            :alt="pokemon.name"
            class="img-fluid pokemon-image"
          />
        </div>

        <!-- right column for details -->
        <div class="col-md-6 text-start">
          <h1>{{ pokemon.name }}</h1>
          
          <p class="card-text mb-3">
            <strong>Types:</strong>
            <span class="pokemon-types">
              <span
                v-for="type in pokemon.types"
                :key="type.type.name"
                :class="'pokemon-type-label'"
                :style="{
                  backgroundColor: typeColors[type.type.name],
                  color: getTextColor(typeColors[type.type.name])
                }"
              >
                {{ type.type.name }}
              </span>
            </span>
          </p>
          
          <p class="card-text mb-3">
            <strong>Abilities:</strong>
            {{ pokemon.abilities.map((t) => t.ability.name).join(", ") }}
          </p>
          
          <p class="card-text mb-3">
            <strong>Height:</strong>
            {{ heightInMeters }} m ({{ heightInFeetInches }})
          </p>
          
          <p class="card-text mb-3">
            <strong>Weight:</strong>
            {{ weightInKilograms }} kg ({{ weightInPounds }} lbs)
          </p>
          
          <div class="mb-3">
            <button class="btn btn-secondary me-2" @click="goBack">
              Back
            </button>
            <button class="btn btn-primary" @click="goToEdit(pokemon)">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokemonStore } from "../stores/pokemonStore";
import { computed } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const pokemonStore = usePokemonStore();
    const selectedPokemon = computed(() => pokemonStore.selectedPokemon);
    const pokemon = selectedPokemon;

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
      Fairy: "#EE99AC",
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

    //function to go back to list
    const goBack = () => {
      router.push({ name: "pokemon-list" });
    };

    //function to go to edit page
    const goToEdit = (pokemon) => {
      pokemonStore.selectPokemon(pokemon);
      router.push({ name: "pokemon-edit", params: { name: pokemon.name } });
    };

    return {
      pokemon,
      goBack,
      goToEdit,
      typeColors,
      getTextColor,
    };
  },
  computed: {
    //function to convert height (decimetre to meter/inch)
    heightInMeters() {
      return (this.pokemon.height / 10).toFixed(1);
    },
    heightInFeetInches() {
      const totalInches = this.pokemon.height * 3.937;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}′${inches}″`;
    },

    //function to convert weight (hectogram to kilogram/pound)
    weightInKilograms() {
      return (this.pokemon.weight / 10).toFixed(1);
    },
    weightInPounds() {
      const pounds = (this.pokemon.weight / 4.536).toFixed(1);
      return pounds;
    }
  }
};
</script>

<style scoped>
.pokemon-image {
  max-width: 100%; /* Ensure image fits within column */
  border-radius: 12px; /* Rounded corners for the image */
  border: 3px solid #ddd; /* Light border around the image */
}

.container {
  background: #f0f8ff; /* Light blue background for the container */
  padding: 20px; /* Add padding inside the container to create space around the content */
  border-radius: 12px; /* Rounded corners for the container */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for a lifted effect */
}

.pokemon-types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Space between type labels */
}

.pokemon-type-label {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: bold;
  text-align: center;
  width: auto;
  min-width: 90px; /* Minimum width for consistency */
  height: 40px;
  line-height: 24px; /* Vertically center text */
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
  text-transform: capitalize; /* Capitalize type names */
  margin: 3px; /* Margin around type labels */
}

h1 {
  color: #000000; /* A vibrant blue for the title */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* Subtle shadow for better readability */
}

.btn {
  border-radius: 5px; /* Rounded corners for buttons */
  font-size: 16px; /* Larger font size for better readability */
}

.btn-secondary {
  background-color: #6c757d; /* Secondary button color */
  border: none; /* Remove default border */
}

.btn-primary {
  background-color: #007bff; /* Primary button color */
  border: none; /* Remove default border */
}

.btn:hover {
  opacity: 0.9; /* Slightly reduce opacity on hover */
}

.text-start {
  color: #333; /* Darker text color for better readability */
}
</style>