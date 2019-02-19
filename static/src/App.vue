<template>
  <div id="app"
    @dragenter.prevent.stop
    @dragover.prevent.stop
    @dragleave.prevent.stop
    @drop.prevent.stop
  >
    <router-view v-if='isRouterAlive'/>
  </div>
</template>

<script>
import { setCookie, getCookie } from './api/cookie';
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  }
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
  color: #333;
  width: 100%;
  font-size: 14px;
  /* margin-top: 60px; */
}
</style>
