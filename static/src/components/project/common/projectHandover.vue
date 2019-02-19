<template>
    <div id="projecthandover">
             <div class="popup" >
            <div class="popup_box">
                <div class="popup_top">
                   <span class="popup_title" >项目交接</span>
                   <i class="iconfont icon-close fr" @click="closePop"></i>
                </div>
                <div class="popup_content popup_content_zke  clearfix">
                   
                </div>
            </div>
            </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    //   关闭弹框
    closePop() {
      this.$emit("closeHandover");
    }
  },
  created() {}
};
</script>
<style lang='less'>
@import "../../../assets/css/base.less";

#projecthandover {
  .popup_content_main {
    width: 400px;
    max-height: 485px;
    min-height: 352px;
    .box_sizing;
  }

  .popup_content_zke {
    width: 800px;
    max-height: 485px;
    min-height: 352px;
    padding: 40px 0;
    overflow: auto;
    .box_sizing;
    .recordList {
      li {
        margin-bottom: 20px;
        color: #999999;
        .creationTime {
          display: inline-block;
          width: 100px;
          margin-left: 23px;
        }
      }
      .name {
        color: #333333;
      }
      .other {
        color: #3684ff;
        cursor: pointer;
      }
      .postscript {
        background: #f2f2f2;
        padding: 15px 0;
        line-height: 1.7;
        color: #333333;
        margin: 10px 0;
        padding: 13px 23px;
        .headline {
          color: #999999;
        }
      }
    }
  }
}
</style>


