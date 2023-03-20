<script setup lang="ts">
import loginApi from "@/api/modules/login";
// 获取数据
interface optsInf {
  params: any;
  getCenterData(): Promise<void>;
}
const getData: optsInf = reactive({
  params: {
    username: "",
    password: "",
  },
  gpsData: {},
  // 概览-用能数据
  getCenterData: async () => {
    const paramsData = {};
    const res = await loginApi.postVerification("/auth/login", getData.params);
  },
});
</script>

<template>
  <div id="login-wrapper">
    <div class="content container">
      <div class="content">
        <div class="login_dialog">
          <el-input
            class="input userName"
            type="text"
            placeholder="请输入账号"
            v-model="getData.params.username"
          >
          </el-input>
          <el-input
            class="input password"
            type="password"
            @keyup.enter="getData.getCenterData"
            placeholder="请输入密码"
            v-model="getData.params.password"
          >
          </el-input>
          <el-button
            size="small"
            type="primary"
            @click="getData.getCenterData"
            class="loginBtn"
            >登录</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus" src="./style.styl" />
