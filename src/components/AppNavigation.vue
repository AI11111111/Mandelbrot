<template>
  <ul>
    <li><RouterLink to="/" exact-active-class="active">Grafische Darstellung</RouterLink></li>
    <li><RouterLink to="/videos" exact-active-class="active">Videos</RouterLink></li>
  </ul>
</template>
<main>
<mandelbrot-viewer/>
</main>
<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333333;
}

li {
  float: left;
}

/* RouterLink ist ein <a>, also gleiche Styles wie vorher */
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
</style>
<script setup lang="ts">
import Videos from '@/views/Videos.vue'
</script>
