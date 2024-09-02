<template>
  <div class="background">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">Pokémon</a>
      </div>
    </nav>
    <router-view />
  </div>
  <footer>
    <p>&copy; 2024 By Hazrul Afiq For JAZRO Robotic Academy</p>
  </footer>
</template>

<style scoped>
.background {
  background-image: url('assets/img/background.jpg');
  background-size: cover; /* Ensure the image covers the entire background */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent the image from repeating */
  background-attachment: fixed; /* Make the background image fixed */
  min-height: 100vh; /* Ensure the container covers at least the full viewport height */
  padding-bottom: 50px; /* Add padding to the bottom to create space for the footer */
}

.navbar {
  background-color: #333; /* Dark background color for navbar to match footer */
}

.navbar-brand {
  color: #fff; /* White text color for brand */
}

.navbar-brand:hover {
  color: #f0f0f0; /* Slightly lighter color on hover */
}

footer {
  background-color: #333; /* Dark background color for footer */
  color: #fff; /* White text color */
  text-align: center; /* Center align text */
  padding: 10px 0; /* Add some padding */
  position: fixed; /* Fix the footer at the bottom of the page */
  width: 100%; /* Full width */
  bottom: 0; /* Align at the bottom */
  left: 0; /* Align to the left edge */
  box-shadow: 0 -2px 5px rgba(0,0,0,0.2); /* Optional: add shadow for better visibility */
}

footer p {
  margin: 0; /* Remove default margin */
}
</style>
