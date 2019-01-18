<template>
    <div id="shadePop"
         class="popup">
        <div class="editStage">
            <div class="titleTop">编辑项目阶段
                <i class="iconfont icon-return fl"
                   @click="closePop"></i>
            </div>
            <div class="defaultLists">
                <ul class="stageLists labelLists clearfix">
                    <li class="stageL fl cur"
                        v-for=" (list,index) in stageLists"
                        :key="index"
                        @click.stop="addStage(list)">
                        <input class="title"
                               v-model="list.title"
                               :disabled="list.isRedact"
                               @change="stageChange(list.title)"
                               @blur.stop="newStageBlur(list.title,list)" />
                        <i class="iconfont icon-bianji"
                           @click.stop="redactStage(list,index)"></i>
                        <i class="iconfont icon-close-"
                           v-if="!list.enabled"
                           @click.stop="delStage(list,index)"></i>
                        <i v-if='list.enabled'
                           class="iconfont icon-xuanze1"></i>
                    </li>
                    <li class="userDefined fl cur"
                        @click="addList">自定义</li>
                </ul>
            </div>

            <div class="selective">
                <p> 阶段展示 </p>
                <div>
                    <draggable v-model="stageLists"
                               @update="datadragEnd"
                               @start='starDrag'
                               :options="{
                                 handle:'.icon-yidong'
                                 }">
                        <transition-group>
                            <div class="stageListCheck"
                                 v-for="(li,index) in stageLists"
                                 :key="li.pkid"
                                 v-if="li.enabled"
                                 :data-partitionid='li.pkid'>
                                <div>
                                    <i class="iconfont icon-yidong cur"></i>
                                    <span class="stageName cur"> {{li.title}}</span>
                                    <i class="iconfont icon-close-"
                                       @click="delCheck(li,index)"></i>
                                    <!-- <span class="close"
                                          @click="delCheck(li,index)">
                                        <i class="iconfont icon-guanbijiantou"></i>
                                    </span> -->
                                </div>
                            </div>
                        </transition-group>
                    </draggable>
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
            stageLists: [], // 默认列表
            newButton: { title: '', pkid: -1, enabled: false, isRedact: false },
            newStageVal: '',
            oldStageVal: '',
        }
    },
    components: {
        draggable,
    },
    watch: {

    },
    props: ['projectId', 'userPkid'],
    methods: {
        //编辑阶段
        redactStage(list, index) {
            this.oldStageVal = list.title; //保存旧值
            list.isRedact = false;
            this.stageLists = [...this.stageLists];
            this.$nextTick(res => {
                $('.labelLists').find('.stageL').find('.title').eq(index).focus()
            })
        },
        // 添加标签
        addStage(list) {
            if (list.Count) {
                this.$message('当前阶段已有内容，不可删除，您可以更改名称');
                return false;
            } else {
                list.enabled = !list.enabled
            }
            let data = { 'stageId': list.pkid }
            this.$HTTP('post', '/stage_update_state', data).then(res => {
                console.log(res)
            })
        },
        // 删除阶段标签
        delStage(list, index) {
            if (list.Count) {
                this.$message('当前阶段已有内容，不可删除，您可以更改名称');
                return false;
            } else {
                this.stageLists.splice(index, 1);
                let data = { stageId: list.pkid }
                this.$HTTP('post', '/stage_delete', data).then(res => {
                    console.log(res)
                })
            }
        },
        // 创建标签失焦
        newStageBlur(title, list) {
            // if (title == '') {
            //     title = this.oldStageVal;
            //     console.log(title, this.oldStageVal)
            //     this.stageLists = [...this.stageLists];
            //     this.$message('阶段名称不能为空')
            // }
            if (list.isNew == false) {

                if (title == this.oldStageVal) {
                    return
                } else {
                    console.log(title)
                    let obj = { stageId: list.pkid, title: title }
                    this.$HTTP('post', '/stage_update', obj).then(res => {
                    })
                }
            } else {
                if (title == '') {
                    this.stageLists.pop();
                } else {
                    list.enabled = true;
                    let data = { 'myUserId': this.userPkid, 'projectId': this.projectId, 'title': title }
                    this.$HTTP('post', '/stage_add', data).then(res => {
                        res.result.isRedact = true;
                        this.stageLists.pop();
                        this.stageLists.push(res.result);
                    })
                }
            }
            list.enabled = true;
            this.stageLists = [...this.stageLists];
        },
        stageChange(val) {
            console.log(val)
        },
        // 添加自定义阶段
        addList() {
            // this.stageLists.push(res.result);
            this.newButton.title = '';
            this.newButton.isRedact = false;
            this.stageLists.push(this.newButton);
            this.$nextTick(res => {
                $('.labelLists').find('.stageL:last').find('.title').focus();
            })
        },

        starDrag(e) {
            console.log(e)
        },
        datadragEnd(evt) {
            let data = { 'stageId': evt.item.dataset.partitionid, 'isSort': evt.newIndex }
            this.$HTTP('post', '/stage_update_isSort', data).then(res => {
                console.log(res)
            })
        },
        // 删除选择的列表
        delCheck(li, index) {
            console.log(li)
            if (li.Count) {
                this.$message('当前阶段已有内容，不可删除，您可以更改名称');
                return false;
            } else {
                li.enabled = !li.enabled;
                this.stageLists[index].enabled = false;
            }
            let data = { 'stageId': li.pkid }
            this.$HTTP('post', '/stage_update_state', data).then(res => {
                console.log(res)
            })
        },
        closePop() {
            this.$emit('closePop');
        },
        getStageLists() {
            let data = { 'projectId': this.projectId }
            this.$HTTP('post', '/stageCount_list_get', data).then(res => {
                this.stageLists = res.result;
                for (let list of this.stageLists) {
                    list.isNew = false;
                    list.isRedact = true;
                }
            })
        },
        cancel() {
            this.$emit('closePop');
        }
    },
    mounted() {

    },
    created() {
        this.getStageLists();
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
      padding: 30px 0;
      .userDefined {
        margin-left: 23px;
        width: 104px;
        height: 37px;
        line-height: 37px;
        text-align: center;
        border: 1px dashed rgba(54, 132, 255, 1);
        border-radius: 4px;
        color: #3684ff;
      }
      .userDefined:hover {
        border: 1px solid rgba(54, 132, 255, 1);
      }
      .box_sizing;
      .stageLists {
        .stageL {
          margin-bottom: 16px;
          width: 104px;
          margin-left: 23px;
          height: 37px;
          border-radius: 4px;
          border: 1px solid rgba(54, 132, 255, 1);
          position: relative;
          //   .main_button_unfixed(@mainColor,@mainColor, #ffffff);
          .title {
            display: inline-block;
            height: 37px;
            line-height: 37px;
            width: 58px;
            overflow: hidden;
            margin-left: 25px;
            border: none;
            .box_sizing;
            outline: none;
            text-overflow: ellipsis;
            white-space: nowrap;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }
          i {
            width: 14px;
            height: 14px;
            position: absolute;
            right: 5px;
            top: 13px;
            font-size: 14px;
            display: none;
          }
          .icon-bianji {
            left: 5px;
            top: 13px;
          }
          .icon-xuanze1 {
            position: absolute;
            right: 5px;
            top: 11px;
            color: @mainColor;
            font-size: 14px;
            display: block;
          }
        }
        .stageL:hover {
          i {
            display: block;
          }
        }
      }
    }
    .selective {
      padding: 25px 0;
      max-height: 300px;
      overflow: scroll;
      .box_sizing;
      //   border-bott/om: 1px solid rgba(242, 242, 242, 1);
      p {
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 25px;
        margin-left: 25px;
      }
      .stageListCheck {
        display: inline-block;
        width: 105px;
        border-radius: 4px;
        height: 37px;
        padding: 10px;
        .box_sizing;
        position: relative;
        border: 1px solid rgba(54, 132, 255, 1);
        margin-left: 23px;
        margin-bottom: 16px;
        .stageName {
          display: inline-block;
          width: 100%;
          height: 100%;
          padding: 0 10px;
          .box_sizing;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
          //   margin: 0 auto;
        }
        i {
          position: absolute;
          right: 5px;
          top: 12px;
          font-size: 14px;
          display: none;
        }
        .icon-yidong {
          left: 5px;
          top: 13px;
        }
      }
      .stageListCheck:hover {
        i {
          display: block;
        }
      }
    }
    // .bottomButton {
    //   width: 100%;
    //   height: 70px;
    //   padding: 0 25px;
    //   position: absolute;
    //   bottom: 0;
    //   .box_sizing;
    //   .cancel {
    //     width: 68px;
    //     color: #999999;
    //     line-height: 70px;
    //   }
    // }
  }
}
</style>
