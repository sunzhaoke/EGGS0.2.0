<template>
    <div id="shadePop"
         class="popup">
        <div class="editStage">
            <div class="titleTop">编辑项目阶段
                <i class="iconfont icon-guanbijiantou fr" @click="closePop"></i>
            </div>
            <div class="defaultLists">
                <el-checkbox-group v-model="checkboxGroup5"
                                   @change="valueChange(checkboxGroup5)"
                                   class="stageLists labelLists">
                    <el-checkbox :label="list.id"
                                 v-for=" (list,index) in stageLists"
                                 :key="index"
                                 contenteditable='true'
                                 border>{{list.name}}</el-checkbox>
                </el-checkbox-group>
                <!-- <div></div> -->
                <div class="userDefined cur"
                     @click="addList">自定义</div>
            </div>

            <div class="selective">
                <p> 阶段展示 </p>
                <div>
                    <draggable v-model="checkStageList"
                               @update="datadragEnd">
                        <transition-group>
                            <div class="stageListCheck"
                                 v-for="(li,index) in checkStageList"
                                 :key="li.id">
                                <div>
                                    <i class="iconfont icon-yidong"></i>
                                    <span> {{li.name}}</span>
                                    <span class="close"
                                          @click="delCheck(li,index)">
                                        <i class="iconfont icon-guanbijiantou"></i>
                                    </span>
                                </div>

                            </div>
                        </transition-group>
                    </draggable>
                </div>
            </div>
            <div class="bottomButton">
                <div class="buttonBox fr">
                    <button class="cancel">取消</button>
                    <button class="main_button_bg">确认</button>
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
        closePop(){
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
@import "../../../assets/css/base.less";
#shadePop {
  .editStage {
    width: 535px;
    min-height: 490px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    position: absolute;
    left: 50%;
    margin-left: -270px;
    top: 10px;
    position: relative;
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
    .defaultLists {
      min-height: 149px;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      padding: 30px 25px;
      .userDefined {
        width: 104px;
        height: 37px;
        line-height: 37px;
        text-align: center;
        border: 1px dashed rgba(54, 132, 255, 1);
        border-radius: 4px;
        color: #3684ff;
      }
      .box_sizing;
      .stageLists {
        label {
          margin-bottom: 16px;
          min-width: 105px;
          margin-left: 0;
          padding: 0 10px !important;
          height: 37px !important;
          border-radius: 4px !important;

          .main_button_unfixed(@mainColor,@mainColor, #ffffff);
          .el-checkbox__inner {
            border-radius: 50%;
          }
        }
      }
    }
    .selective {
      padding: 25px;
      .box_sizing;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      p {
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 25px;
      }
      .stageListCheck {
        display: inline-block;
        min-width: 105px;
        border-radius: 4px;
        height: 37px;
        padding: 10px;
        .box_sizing;
        position: relative;
        border: 1px solid rgba(54, 132, 255, 1);
        .close {
          display: inline-block;
          width: 14px;
          height: 14px;
          background: #e0e0e0;
          color: #ffffff;
          line-height: 10px;
          text-align: center;
          border-radius: 50%;
          position: absolute;
          right: 6px;
          top: 12px;
          display: none;

          i {
            font-size: 10px;
          }
          .icon-guanbijiantou {
          }
        }
      }
      .stageListCheck:hover {
        .close {
          display: block;
        }
      }
    }
    .bottomButton {
      width: 100%;
      height: 70px;
      padding: 0 25px;
      position: absolute;
      bottom: 0;

      .box_sizing;
      .cancel {
        width: 68px;
        color: #999999;
        line-height: 70px;
      }
    }
  }
}
</style>
