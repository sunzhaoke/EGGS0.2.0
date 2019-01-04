<template>
    <div id="shadePop"
         class="popup">
        <div class="editStage">
            <div class="titleTop">编辑项目阶段
                <i class="iconfont icon-guanbijiantou fr"
                   @click="closePop"></i>
            </div>
            <div class="defaultLists">
                <ul class="stageLists labelLists clearfix">
                    <li class="stageL fl cur"
                        v-for=" (list,index) in stageLists"
                        :key="index"
                        @dblclick='dbRedact()'
                        @click="addStage(list)">
                        <span class="title"
                              :contenteditable='isCont'
                              :v-bind="list.title"
                              @keyup="changeValue"
                              @blur="newStageBlur(list.title,list)">{{list.title}}</span>
                        <i v-if='list.enabled'
                           class="iconfont icon-wancheng_huaban"></i>
                        <span class="close"
                              v-if="!list.enabled"
                              @click.stop="delStage(list,index)">
                            <i class="iconfont icon-guanbijiantou"></i>
                        </span>
                    </li>
                </ul>
                <div class="userDefined cur"
                     @click="addList">自定义</div>
            </div>

            <div class="selective">
                <p> 阶段展示 </p>
                <div>
                    <draggable v-model="stageLists"
                               @update="datadragEnd"
                               @start='starDrag'>
                        <transition-group>
                            <div class="stageListCheck"
                                 v-for="(li,index) in stageLists"
                                 :key="li.pkid"
                                 v-if="li.enabled"
                                 :data-partitionid='li.pkid'>
                                <div>
                                    <i class="iconfont icon-yidong cur"></i>
                                    <span> {{li.title}}</span>
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
                    <button class="cancel"
                            @click="cancel">取消</button>
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
            isCont: true,
            stageLists: [], // 默认列表
            newButton: { title: '', pkid: -1, enabled: false },
            newStageVal: '',
        }
    },
    components: {
        draggable,
    },
    props: ['projectId', 'userPkid'],
    methods: {
        changeValue(e) {
            this.newStageVal = $(e.target).text();
        },
        // 添加标签
        addStage(list) {
            list.enabled = !list.enabled
        },
        dbRedact() {
            this.isCont = true;
        },

        // 删除阶段标签
        delStage(list, index) {

            this.stageLists.splice(index, 1);
            let data = { stageId: list.pkid }
            this.$HTTP('post', '/stage_delete', data).then(res => {
                console.log(res)
            })
        },
        // 创建标签失焦
        newStageBlur(title, list) {
            this.isCont = true;
            // title = this.newStageVal;
            if (list.isNew == false) {
                console.log('不是新建')
                return

                if (title == '') {
                    this.stageLists.pop();
                }
            } else {
                title = this.newStageVal;
                if (title == '') {
                    this.stageLists.pop();
                    console.log('新建 ')
                } else {
                    console.log(title, '新建 有名字')
                    list.enabled = true;
                    // list.title = this.newStageVal;
                    let data = { 'myUserId': this.userPkid, 'projectId': this.projectId, 'title': title }
                    this.$HTTP('post', '/stage_add', data).then(res => {
                        console.log(res)

                    })
                }
            }
        },
        // 添加自定义阶段
        addList() {
            this.newButton.title = ''
            this.stageLists.push(this.newButton);
            this.$nextTick(res => {
                this.isCont = true;
                $('.labelLists').find('.stageL:last-child').find('.title').focus();
            })
        },
        // 值改变
        valueChange(list) {
            list.enabled = !list.enabled;
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
            li.enabled = !li.enabled;
            console.log(index)
            this.stageLists[index].enabled = false;

            return
            this.checkStageList.splice(index, 1)
            let id = this.stageLists.findIndex(res => {
                return li.id == res.id;
            })
        },
        closePop() {
            this.$emit('closePop');
        },
        getStageLists() {
            let data = { 'projectId': this.projectId }
            this.$HTTP('post', '/stageCount_list_get', data).then(res => {
                console.log(this.stageLists)

                this.stageLists = res.result;
                for (let list of this.stageLists) {
                    list.isNew = false;
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
          .icon-wancheng_huaban {
            position: absolute;
            right: 5px;
            top: 11px;
            color: @mainColor;
            font-size: 14px;
          }
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
            left: 6px;
            top: 12px;
            display: none;

            i {
              font-size: 10px;
            }
            .icon-guanbijiantou {
            }
          }
        }
        .stageL:hover {
          .close {
            display: inline-block;
          }
        }
      }
    }
    .selective {
      padding: 25px 0;
      .box_sizing;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      p {
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 25px;
        margin-left: 25px;
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
        margin-left: 23px;
        margin-bottom: 16px;
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
