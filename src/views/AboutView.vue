<script lang="ts" setup>
import MyIcon from '@/assets/svg_test.svg?component';
const drawer = ref(false)
const open1 = () => {
  ElNotification({
    title: 'Success',
    message: 'This is a success message',
    type: 'success',
  })
}
const open = () => {
  ElMessage('this is a message.')
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
<template>
  <div class="about">
    <MyIcon
      width="125"
      height="125"/>
    <i-teenyicons-360-outline style="font-size: 1.5em; color: #ff6a00" />
    <h1>This is an about page</h1>
    <el-button plain @click="open1"> Closes automatically </el-button>
    <el-button :plain="true" @click="open">Show message</el-button>
    <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
      open
    </el-button>

    <el-drawer
      v-model="drawer"
      title="I am the title"
      :direction="direction"
      :before-close="handleClose"
    >
      <span>Hi, there!</span>
    </el-drawer>
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
