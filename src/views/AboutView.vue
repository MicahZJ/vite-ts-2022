<script lang="ts" setup>
import { useCounterStore } from "@/stores/counter";
import { isDark, toggleDark } from "@/utils/dark";
const userCount = useCounterStore();
import MyIcon from "@//assets/svg_test.svg";
const drawer = ref(false);
const direction = ref("rtl");
const open1 = () => {
  ElNotification({
    title: "Success",
    message: "This is a success message",
    type: "success",
  });
};
const open = () => {
  ElMessage("this is a message.");
};
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure you want to close this?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
<template>
  <div class="about">
    <MyIcon width="125" height="125" />
    <i-uil-0-plus style="font-size: 1.5em; color: #ff6a00" />
    <h1 class="animate-bounce">This is an about page</h1>
    <el-button plain @click="open1"> Closes automatically </el-button>
    <el-button :plain="true" @click="open">Show message</el-button>
    <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
      open
    </el-button>
    <el-button @click="userCount.increment">increment</el-button>
    <el-drawer
      v-model="drawer"
      title="I am the title"
      :direction="direction"
      :before-close="handleClose"
    >
      <span>Hi, there!</span>
    </el-drawer>
    <el-button type="danger">Danger</el-button>
    <span class="text-red-400 dark:text-green-400"> {{ userCount.count }}</span>
    <button class="icon-btn mx-2 !outline-none" @click="toggleDark()">
      <i-ph-cloud-moon-bold v-if="isDark" class="icon-footer" />
      <i-ph-sun-horizon-bold v-else class="icon-footer" />
    </button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
