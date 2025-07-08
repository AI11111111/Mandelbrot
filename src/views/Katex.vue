<template>
  <span ref="container"></span>
</template>

<script setup lang="ts">
import katex from 'katex'
import { onMounted, watch, ref } from 'vue'

const props = defineProps<{
  expression: string
  displayMode?: boolean
}>()

const container = ref<HTMLElement>()

const render = () => {
  if (container.value) {
    katex.render(props.expression, container.value, {
      throwOnError: false,
      displayMode: props.displayMode ?? false
    })
  }
}

onMounted(render)
watch(() => props.expression, render)
</script>
