<template>
  <ul>
    <li><RouterLink to="/" exact-active-class="active">Grafische Darstellung</RouterLink></li>
    <li><RouterLink to="/about" exact-active-class="active">About</RouterLink></li>
  </ul>
  <main>
    <mandelbrot-viewer/>
  </main>
</template>
<script setup lang="ts">
import MandelbrotViewer from "./views/Mandelbrot.vue";
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}
ul {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333333;
  z-index: 1000;
}

li {
  float: left;
}

a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

a:hover:not(.active) {
  background-color: #111111;
}

a.active {
  background-color: #4caf50;
}

main {
  padding-top: 50px; /* damit der Inhalt nicht unter der Leiste klebt */
}
</style>
