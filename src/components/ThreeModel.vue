<script setup lang="ts">
import ThreeD from "../utils/threeCamera";
const dom = ref<HTMLElement | null>(null);

let threeObj: any = {};

onMounted(() => {
  threeObj = new ThreeD(8, 50, 60, 8, 50);
  dom.value && threeObj.initThree(dom.value);
  // 给模型绑定事件
  window.addEventListener("click", threeObj.clickObj, false);
});

onBeforeUnmount(() => {
  // pointerdown
  window.removeEventListener("click", threeObj.clickObj, false);
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
