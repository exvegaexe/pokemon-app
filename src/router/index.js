import { createRouter, createWebHistory } from 'vue-router';
import PokemonList from '../views/PokemonList.vue';
import PokemonDetails from '../views/PokemonDetails.vue';
import PokemonEdit from '../views/PokemonEdit.vue';

const routes = [
  { path: '/', name: 'pokemon-list', component: PokemonList },
  { path: '/pokemon/:name', name: 'pokemon-details', component: PokemonDetails },
  { path: '/pokemon/edit/:name', name: 'pokemon-edit', component: PokemonEdit }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;