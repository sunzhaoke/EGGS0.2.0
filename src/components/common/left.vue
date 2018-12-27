<template>
  <div id="k_leftNav">
    <div class="middleNav">
      <ul class="navLists">
        <li class="list"
            v-for="(nav,index) in navList"
            :key="index"
            :class="{'checkNav': menuSelected==nav.id }"
            @click="checkNav(nav)">
          <i class="iconfont "
             :class="nav.name"></i>
          <p class="names cur">{{nav.prompt}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        {
          id: "01",
          name: "iconfont icon-gongzuotai",
          path: "/workbench",
          menuSelected: true,
          prompt: "工作台"
        },
        {
          id: "02",
          name: "iconfont icon-gongdan",
          path: "/project",
          menuSelected: false,
          prompt: "项目"
        },
        {
          id: "03",
          name: "icon-wenjian1",
          path: "/personalDocuments",
          menuSelected: false,
          prompt: "个人文档"
        },
      ],
      menuSelected: "01"
    };
  },
  methods: {
    checkNav(nav, navList) {
      let randomNum1 = Math.random().toFixed(4);
      this.menuSelected = nav.id;
      this.$router.push(nav.path);
      localStorage.setItem("menuSelected", this.menuSelected);
    },

  },
  created() { },
  mounted() {
    this.menuSelected = localStorage.getItem("menuSelected");
  }
};
</script>

<style lang='less'>
@import "../../assets/css/base.less";
#k_leftNav {
  width: 100%;
  height: 100vh;
  background: #ffffff;
  .top {
    width: 166px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-right: 1px solid @bg-f2f2f2;
    border-bottom: 1px solid @bg-f2f2f2;
    .box_sizing;
    .eggsLogo {
      vertical-align: middle;
      .cur;
    }
  }
  .middleNav {
    width: 100px;
    position: relative;
    height: calc(100% - 60px);
    text-align: center;
    i {
      font-size: 18px;
    }
    .navLists {
      position: absolute;
      width: 100%;
      top: 50%;
      margin-top: -100px;

      // left:50%;
      // top: 0;
      // right: 0;
      // bottom: 0;
      // margin: auto;
      .list {
        text-align: center;
        margin-bottom: 45px;
      }
      .checkNav {
        color: @mainColor;
      }
    }
  }
}
</style>
