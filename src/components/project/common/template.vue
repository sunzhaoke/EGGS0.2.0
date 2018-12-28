<template>
    <div class="new_template" >
        <div class="popup popup1_k" v-if="false">
            <div class="popup_box">
                <div class="popup_top">
                    <!-- <i class="iconfont icon-return fl"></i> -->
                    <span class="popup_title">标准模板</span>
                    <i class="iconfont icon-close fr" @click="closeNewProject"></i>
                </div>
                <div class="popup_content">
                    <div class="blankTemplate clearfix">
                      <p class="moduleTittle">空白项目</p>
                      <div class="card_module" @click="newBlankTem">
                        <div>
                            <i class="iconfont icon-jia"></i>
                            <span>空白项目</span>
                        </div>
                      </div>
                    </div>
                    <div class="industryTemplate clearfix">
                      <p  class="moduleTittle">行业模板</p>                 
                      <div class="card_module">
                        <div class="card_module_main">
                          <p>产品进展</p> 
                          <p class="hoverFont">适用于互联网产品人员对产品计划、跟进及发布管理</p>                         
                          <span class="cardShade"></span>
                          <img src=" ../../assets/img/module_1.png" alt="">
                        </div>       
                      </div>
                        <div class="card_module">
                          <div class="card_module_main">
                            <p>产品开发</p> 
                            <p class="hoverFont">产品开发2</p> 
                            <span class="cardShade"></span>
                            <img src="../../../assets/img/module_2.png" alt="">
                          </div>                      
                       </div>
                    </div>
                </div>
            </div>
        </div>
      <Info v-if="newProjectPopShow" @closePop='closeInfo' classify='newInformation'></Info>
    </div>
</template>
<script>
import Info from "./info";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  components: {
    Info
  },
  props: ["Info"],
  data() {
    return {
      newProjectPopShow: false //新建项目填写信息弹框 是否显示
    };
  },
  computed: {
    ...mapState(["newProjectPop"])
  },

  methods: {
    ...mapMutations(["SHOW_NEWPREJECTPOP"]),
    // 点击空白项目
    newBlankTem() {
      this.newProjectPopShow = true;
      this.SHOW_NEWPREJECTPOP(false);
    },
    // 关闭新建项目
    closeNewProject() {
      this.SHOW_NEWPREJECTPOP(false);
    },
    closeInfo() {
      this.newProjectPopShow = false;
    }
  },
  created() {}
};
</script>
<style lang="less">
@import "../../../assets/css/base.less";
.new_template {
  .popup1_k .popup_content {
    width: 800px;
    min-height: 100px;
    padding: 25px;
    .box_sizing;
    .moduleTittle {
      margin-bottom: 15px;
      font-weight: bold;
    }
    .card_module {
      width: 234px;
      height: 124px;
      text-align: center;
      line-height: 124px;
      background: rgba(252, 252, 252, 1);
      border-radius: 4px;
      box-shadow: 0px 1px 4px 0px rgba(126, 126, 126, 0.4);
      float: left;
      cursor: pointer;
      overflow: hidden;
      .card_module_main {
        width: 100%;
        height: 100%;
        position: relative;
        color: #ffffff;
        p {
          position: absolute;
          z-index: 101;
          left: 50%;
          margin-left: -30px;
          color: rgba(252, 252, 252, 1);
        }
        .hoverFont {
          display: block;
          position: absolute;
          color: rgba(252, 252, 252, 0);
          width: 206px;
          left: 50%;
          margin-left: -103px;
        }
        img {
          position: absolute;
          left: 0;
          z-index: 99;
        }
        .cardShade {
          width: 100%;
          height: 100%;
          display: inline-block;
          background: rgba(0, 0, 0, 0.4);
          position: absolute;
          left: 0;
          z-index: 100;
          transition: all 0.3s linear;
        }
      }
    }
    .card_module:hover {
      box-shadow: 0px 1px 4px 0px rgba(126, 126, 126, 0.7);
      p {
        color: rgba(252, 252, 252, 0);
      }
      .cardShade {
        background: rgba(0, 0, 0, 0.6);
      }
      .hoverFont {
        color: rgba(252, 252, 252, 1);
        width: 206px;
        left: 50%;
        margin-left: -103px;
      }
    }
    // 行业模板
    .industryTemplate {
      margin-top: 25px;
      .card_module {
        margin-left: 3%;
      }
      & div:first-of-type {
        margin-left: 0;
      }
    }
  }
}
</style>

