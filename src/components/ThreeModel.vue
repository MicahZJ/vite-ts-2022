<script setup lang="ts">
import ThreeD from "../utils/threeTest";
const dom = ref<HTMLElement | null>(null);

onMounted(() => {
  const three = new ThreeD(8, 50, 60, 8, 50);
  dom.value && three.initThree(dom.value);
});
</script>

<template lang="pug">
div#container(ref="dom")
</template>

<style scoped lang="stylus">
#container
  width 100%
  height 100%
</style>
