<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { setCookie, getCookie } from './api/cookie';
export default {

  name: "App"
}

</script>

<style>
@import "./assets/css/common.css";
@import "./assets/iconFont/iconfont.css";
#app {
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Helvetica,
    Arial, "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-seri,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
