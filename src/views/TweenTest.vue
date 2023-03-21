<script setup lang="ts">
import * as TWEEN from "@tweenjs/tween.js";

const initTWEEN = () => {
  let target = document.getElementById("target");

  // { x: 50 } 要加动画的元素在动画开始时的属性
  // { x: 400 } 要加动画的元素在动画结束时的属性
  // 3000 动画执行持续的毫秒数
  // .delay(1000) 动画执行延时毫秒数
  // easing(TWEEN.Easing.Elastic.InOut) 动画的速度曲线
  // .onUpdate(update) 传入一个函数update，在函数中可以拿到元素当前的属性，根据这些属性进行视图的更新
  // .start() 加上这个方法才会开始动画
  //
  // 以下完整代码执行后target元素就会从transform = translateX(50px)移动到transform = translateX(400px)，移动的速度曲线是Elastic.InOut，移动的持续时间是3000毫秒

  let tween = new TWEEN.Tween({ x: 50 })
    .to({ x: 400 }, 3000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate((object) => {
      if (target) target.style.transform = "translateX(" + object.x + "px)";
    })
    .start();
};
const animate = (time: any) => {
  requestAnimationFrame(animate);
  TWEEN.update(time);
};

onMounted(() => {
  initTWEEN();
  animate(null);
});

onBeforeUnmount(() => {
  // pointerdown
});
</script>

<template lang="pug">
div.tween_box
  div#target
</template>

<style scoped lang="stylus">
.tween_box
  width 100%
  height 100%
  //background #b457e1
  display flex
  justify-content center
  align-items center
  #target {
    position: absolute;
    top: 80px;
    left: 40px;
    width: 50px;
    height: 50px;
    background-color: tomato;
  }
</style>
