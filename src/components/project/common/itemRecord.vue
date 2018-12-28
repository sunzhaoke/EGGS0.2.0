<template>
    <div id="Info_k">
        <div class="">
            <div class="popup" >
            <div class="popup_box">
                <div class="popup_top">
                    <span class="popup_title" >项目记录</span>
                    <i class="iconfont icon-close fr" @click="closeNewPop"></i>
                </div>
                <div class="popup_content popup_content_ke popup_content_main clearfix">
                    <ul class="recordList">
                        <li v-for="(list,index) in recordList" :key="index">
                          <span class="creationTime">{{list.createTime}}</span>
                          <span class="name">{{list.userName}}</span>
                          <span>{{list.typeName}}</span>
                          <span v-if="list.type==3" class="other" @click="openOhter(list,index)">{{list.type2Name}}</span>
                          <div class="postscript" v-show="list.open">
                            <i class="iconfont"></i>
                            <div class="headline">修改前：</div>
                            <div>{{list.frontContent}}</div>
                            <div class="headline">修改后：</div>
                            <div>{{list.backContent}}</div>                          
                          </div>
                        </li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      recordList: []
    };
  },
  filters: {},
  result: "",
  props: ["projectId"],
  watch: {},
  methods: {
    ...mapMutations(["SHOW_NEWPREJECTPOP"]),
    // 点击关闭创建
    closeNewPop() {
      this.$emit("closeItem");
    },
    // 获取记录列表
    getRecordList(projectId) {
      let data = { projectId: projectId };
      this.$HTTP("post", "/projectLog_getListByProjectId", data).then(res => {
        this.recordList = res.result;
        for (let time of this.recordList) {
          time.open = false;
          time.createTime = time.createTime.replace(new RegExp("-", "gm"), "/");
          time.createTime = new Date(time.createTime).getTime();
          console.log(time.createTime);
          time.createTime = this.getDateDiff(time.createTime);
        }
      });
    },
    // 展开详细列表
    openOhter(recordList, index) {
      this.recordList[index].open = !this.recordList[index].open;
      this.recordList = [...this.recordList];
    },
    getDateDiff(valueTime) {
      var newData = Date.parse(new Date());
      var diffTime = Math.abs(newData - valueTime);
      if (diffTime > 7 * 24 * 3600 * 1000) {
        var date = new Date(valueTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? "1" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return m + "-" + d + " " + h + ":" + minute;
      } else if (
        diffTime < 7 * 24 * 3600 * 1000 &&
        diffTime > 24 * 3600 * 1000
      ) {
        // //注释("一周之内");
        // var time = newData - diffTime;
        var dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000));
        return dayNum + "天前";
      } else if (diffTime < 24 * 3600 * 1000 && diffTime > 3600 * 1000) {
        // //注释("一天之内");
        // var time = newData - diffTime;
        var dayNum = Math.floor(diffTime / (60 * 60 * 1000));
        return dayNum + "小时前";
      } else if (diffTime < 3600 * 1000 && diffTime > 1) {
        // //注释("一小时之内");
        // var time = newData - diffTime;
        var dayNum = Math.floor(diffTime / (60 * 1000));
        return dayNum + "分钟前";
      } else if (diffTime < 3600 * 1000 && diffTime < 1) {
        return "刚刚";
      }
    }
  },
  created() {
    this.getRecordList(this.projectId);
  }
};
</script>
<style lang='less'>
@import "../../../assets/css/base.less";

#Info_k {
  .popup_content_main {
    width: 400px;
    max-height: 485px;
    min-height: 352px;
    .box_sizing;
  }
  .popup_content_ke {
    width: 400px;
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

