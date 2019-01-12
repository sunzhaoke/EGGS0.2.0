<template>
    <div id="toLead"
         class="popup">
        <div class="editStage">
            <div class="titleTop">导入
                <i class="iconfont icon-guanbijiantou fr"
                   @click="closePop"></i>
            </div>
            <div class="mainBox">
                <span>
                    <img src="../../../../assets/img/tolead.png"
                         width="278px"
                         alt="">
                </span>
                <span class="icon">
                    <i class="iconfont icon-chaoxian_right"></i>
                </span>
                <span>
                    <img src="../../../../assets/img/datalog.png"
                         width="278px"
                         alt="">
                </span>

                <p>
                    通过将Xmind中的思维导图导出为Excel格式，再导入我们系统，就能将思维导图转换为我们的任务目录 您也可以直接下载Excel模板，填写目录内容后批量导入
                </p>
            </div>

            <div class="bottomButton">
                <div class="buttonBox fr">
                    <button class="main_button_bg">上传Excel文件</button>
                    <button class="main_button_border">下载Excel模板</button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import draggable from "vuedraggable";

export default {
    data() {
        return {
            stageLists: [
                { name: '产品规划', id: 1, active: true },
                { name: '产品设计', id: 2, active: true },
                { name: '开发阶段', id: 3, active: true },
                { name: '测试阶段', id: 4, active: true },
            ], // 默认列表
            newButton: [
                { name: '', id: 1, active: true },
            ],
            checkboxGroup5: [1, 2, 3, 4],
            checkStageList: [{ name: '产品规划', id: 1, active: true },
            { name: '产品设计', id: 2, active: true },
            { name: '开发阶段', id: 3, active: true },
            { name: '测试阶段', id: 4, active: true },]
        }
    },
    components: {
        draggable,
    },
    props: [],
    methods: {
        // 添加自定义阶段
        addList() {
            this.stageLists.push(this.newButton)

            this.$nextTick(res => {
                $('.labelLists').find('label:last-child').focus()
                console.log()
            })
        },
        // 值改变
        valueChange(el) {
            console.log(el)
        },
        datadragEnd() {

        },
        // 删除选择的列表
        delCheck(li, index) {
            this.checkStageList.splice(index, 1)
            console.log(li, index)
            let id = this.stageLists.findIndex(res => {
                return li.id == res.id;
            })
            // thi.stageLists[id]
            console.log(index)
        },
        closePop() {
            this.$emit('closePop');
        }
    },
    mounted() {

    },
    created() {

    }
}
</script>

<style lang='less'>
@import "../../../../assets/css/base.less";
#toLead {
  .editStage {
    width: 800px;
    min-height: 490px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    position: absolute;
    // transform: translateY(-50%);
    .titleTop {
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      font-size: 16px;
      font-family: "PingFang-SC-Bold";
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      padding: 0 20px;
      .box_sizing;
    }
    .mainBox {
      padding: 70px 83px 38px 83px;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      span {
        display: inline-block;
        float: left;
      }
      img {
        margin-bottom: 60px;
      }
      .icon {
        height: 165px;
        line-height: 165px;
        text-align: center;
        width: 68px;
        display: inline-block;
        i {
          font-size: 32px;
          color: #3684ff;
        }
      }
    }
    .bottomButton {
      width: 100%;
      height: 70px;
      line-height: 70px;
      padding: 0 25px;
      position: absolute;
      bottom: 0;
      .box_sizing;
    }
    p {
      text-align: center;
      line-height: 1.5;
    }
  }
}
</style>
