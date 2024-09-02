<template>
  <div class="container my-4" v-if="selectedPokemon">
    <div
      class="row justify-content-center align-items-center"
      style="min-height: 75vh"
    >
      <!-- left column for image -->
      <div class="col-md-4 text-center">
        <img
          :src="selectedPokemon.sprites.other['official-artwork'].front_default"
          :alt="selectedPokemon.name"
          class="img-fluid pokemon-image"
        />
      </div>

      <!-- right column for edit form -->
      <div class="col-md-6 text-start">
        <h1>Edit Pokémon</h1>
        <form @submit.prevent="saveDetails">
          <label for="name" class="form-label"><strong>Name</strong></label>
          <input
            type="text"
            v-model="selectedPokemon.name"
            class="form-control"
            id="name"
          />

          <label class="form-label mt-3"><strong>Types</strong></label>
          <div class="pokemon-types">
            <div
              v-for="type in allTypes"
              :key="type"
              class="form-check form-check-inline"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="'type-' + type"
                :value="type"
                v-model="selectedTypes"
              />
              <label
                class="form-check-label pokemon-type-label"
                :for="'type-' + type"
                :style="{ backgroundColor: typeColors[type], color: getTextColor(typeColors[type]) }"
              >
                {{ type }}
              </label>
            </div>
          </div>

          <!-- input repeater for ability -->
          <label for="abilities" class="form-label mt-3"><strong>Abilities</strong></label>
          <div v-for="(ability, index) in abilitiesInput" :key="index" class="input-group mb-3">
            <input
              type="text"
              v-model="abilitiesInput[index]"
              class="form-control"
              :placeholder="'Ability ' + (index + 1)"
            />
            <button
              class="btn btn-outline-danger"
              type="button"
              @click="removeAbility(index)"
            >
              Delete
            </button>
          </div>

          <!-- button for add ability-->
          <div class="text-center mt-2">
            <button
              class="btn btn-outline-success"
              type="button"
              @click="addAbility"
            >
              Add Ability
            </button>
          </div>

          <label for="height" class="form-label mt-3"><strong>Height (in decimetres)</strong></label>
          <input
            type="number"
            v-model.number="selectedPokemon.height"
            class="form-control"
            id="height"
          />

          <label for="weight" class="form-label mt-3"><strong>Weight (in hectograms)</strong></label>
          <input
            type="number"
            v-model.number="selectedPokemon.weight"
            class="form-control"
            id="weight"
          />

          <div class="mb-3">
            <button class="btn btn-secondary me-2" @click="goBack">
              Back
            </button>
            <button type="submit" class="btn btn-primary mt-3">
              Save
            </button> 
          </div>        
        </form>
      </div>
    </div>
  </div>
  <div v-else>
    <p>No Pokémon selected for editing.</p>
  </div>
</template>

<script>
import { usePokemonStore } from "../stores/pokemonStore";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const pokemonStore = usePokemonStore();
    const selectedPokemon = computed(() => pokemonStore.selectedPokemon);
    const alertMessage = ref('');
    const alertClass = ref('');

    const allTypes = ref([
      "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting",
      "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost",
      "Dragon", "Dark", "Steel", "Fairy"
    ]);

    //define colours for each type
    const typeColors = ref({
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
    });

    //dynamic function to make text in type either white or black for readability
    const getTextColor = (backgroundColor) => {
      const hex = backgroundColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "black" : "white";
    };

    const selectedTypes = ref(selectedPokemon.value ? selectedPokemon.value.types.map(t => t.type.name) : []);
    const abilitiesInput = ref(selectedPokemon.value ? selectedPokemon.value.abilities.map(a => a.ability.name) : []);

    //function to add empty input for ability
    const addAbility = () => {
      abilitiesInput.value.push("");
    };

    //function to delete input for ability
    const removeAbility = (index) => {
      abilitiesInput.value.splice(index, 1);
    };

    //function to go back to detail
    const goBack = () => {
      router.push({ name: 'pokemon-details', params: { name: pokemon.name } });
    };

    //function to save edited detail
    const saveDetails = () => {
      const abilitiesArray = abilitiesInput.value.filter(ability => ability.trim()); // Filter out any empty fields

      selectedPokemon.value.types = selectedTypes.value.map(type => ({ type: { name: type } }));
      selectedPokemon.value.abilities = abilitiesArray.map(ability => ({ ability: { name: ability } }));

      pokemonStore.updatePokemonDetails(selectedPokemon.value);

      router.push({
        name: "pokemon-details",
        params: { name: selectedPokemon.value.name },
      });
    };

    // watch for changes in selectedPokemon to update types and abilities
    watch(selectedPokemon, (newValue) => {
      if (newValue) {
        selectedTypes.value = newValue.types.map(t => t.type.name);
        abilitiesInput.value = newValue.abilities.map(a => a.ability.name);
      }
    });

    return {
      selectedPokemon,
      alertMessage,
      alertClass,
      allTypes,
      typeColors,
      selectedTypes,
      goBack,
      saveDetails,
      abilitiesInput,
      removeAbility,
      addAbility,
      getTextColor,
    };
  },
};
</script>

<style scoped>
/* Transition for fade effect */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.container {
  background: #f0f8ff; /* Light blue background for the container */
  padding: 20px; /* Add padding inside the container to create space around the content */
  border-radius: 12px; /* Rounded corners for the container */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for a lifted effect */
}

.pokemon-image {
  border-radius: 12px; /* Rounded corners for the image */
  border: 3px solid #ddd; /* Light border around the image */
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
  min-width: 90px; /* Minimum width for consistency */
  height: 40px;
  line-height: 24px; /* Vertically center text */
  margin: 3px; /* Margin around type labels */
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
  transition: all 0.3s ease; /* Smooth transition for visual changes */
}

.pokemon-type-label:hover {
  background-color: #f0f0f0; /* Light background on hover */
  color: black; /* Text color on hover */
  cursor: pointer; /* Pointer cursor on hover */
}

h1 {
  color: #000000; /* Vibrant blue for the title */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* Subtle shadow for better readability */
}

.pokemon-type-label {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
  width: 100px;
  height: 40px;
  line-height: 24px;
  margin: 5px;
  text-transform: capitalize;
  box-sizing: border-box;
  position: relative; /* Make it a positioning context for the pseudo-element */
  transition: all 0.3s ease; /* Smooth transition for visual changes */
}

/* Hide the checkbox */
.form-check-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* Style for the selected type labels */
.form-check-input:checked + .pokemon-type-label {
  border: 3px solid black; /* Thicker border for selected state */
  background-color: #ffffff; /* Background color change when selected */
  color: #000000; /* Text color change when selected */
  padding: 5px 16px; /* Adjust padding */
}

/* Add a checkmark symbol to the left of the label when selected */
.form-check-input:checked + .pokemon-type-label::before {
  content: '✔'; /* Checkmark symbol */
  position: absolute; /* Position it relative to the label */
  left: -30px; /* Adjust position from the left */
  top: 50%; /* Center it vertically */
  transform: translateY(-50%); /* Center vertically */
  color: green; /* Color of the checkmark */
  font-size: 20px; /* Size of the checkmark */
  line-height: 0; /* Remove extra line height */
  transition: opacity 0.3s ease; /* Smooth transition for checkmark visibility */
}

/* Optionally add a hover effect to the label */
.pokemon-type-label:hover {
  background-color: #f0f0f0; /* Light background on hover */
  cursor: pointer; /* Pointer cursor on hover */
}

/* Add a gap between the button and container */
.btn-primary {
  background-color: #007bff; /* Primary button color */
  border: none; /* Remove default border */
  margin-bottom: 1rem; /* Add gap above the button */
}

.btn-primary:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

</style>