<template>
    <div class="state_manage_y"
        @mouseleave='mouseLeave'
        >
        <ul v-if='list && list.length' class="list_ul">
            <li v-for="(item, index) in list"
                :key="index"
                @click.stop="change(index)">
                <img class="header"
                     :src="item.userPic"
                     alt="">
                <span class="names">{{item.nickName ? item.nickName : item.userName}}</span>
                <el-checkbox v-model="item.IsState"></el-checkbox>
            </li>
        </ul>
        <div v-else class="list_ul">
            <p>该阶段暂无人员参与</p>
        </div>
        <div class="state_manage_bottom">
            <button v-if='!allChecked' class="main_button_color" @click.stop="allChange">标记全部完成</button>
            <button v-else class="main_button_disabled">标记全部完成</button>
        </div>
    </div>
</template>
<script>

export default {
    props: ["data"],
    data() {
        return {
            list: [],
            defaultKeys: [],
            allChecked: false,
        }
    },
    watch: {
        list: {
            deep: true,
            handler(val) {
                const index = val.findIndex(ele => !ele.IsState);
                if(index === -1) {
                    this.allChecked = true;
                }else {
                    this.allChecked = false;
                }
            }
        }
    },

    methods: {
        mouseLeave() {
            return;
            this.computedNum().then(res => {
                this.$emit('handleSure', res);
            });
        },
        cancel() {
            // this.$emit('handleManageChange', {});
        },
        allChange() {
            let id = [];
            let selfId = [];
            this.list.map(ele => {
                id.push(ele.stageTaskUserId);
                selfId.push(ele.userpkid);
                return ele.IsState = true;
            });
            this.$emit('handleSure', id, selfId, true, 'all');
        },

        change(index) {
            this.list[index].IsState = !this.list[index].IsState;
            let id = [this.list[index].stageTaskUserId];
            let selfId = [this.list[index].userpkid];
            // console.log('---id', this.list,index, this.list[index].stageTaskUserId);
            this.$emit('handleSure', id, selfId, this.list[index].IsState, this.list[index].nickName ? this.list[index].nickName : this.list[index].userName);
        },
        checkedList() {
            let ids = [];
            for (let x of this.list) {
                x.IsState && ids.push(x.userpkid);
            }
            this.defaultKeys = ids;
        },


        // 确定当前人数，以及添加或删除的人数
        computedNum() {
            return new Promise((resolve) => {
                let ids = [];
                for (let x of this.list) {
                    (x.IsState) && ids.push(x.userpkid);
                }
                if (ids.sort().toString() === this.defaultKeys.sort().toString()) {
                    // 人员没用变动
                    resolve(null);
                    return null;
                } else {
                    // 人员变动：添加/减少
                    resolve(ids);
                    return ids;

                }
            });
        },
    },
    created() {

    },
    mounted() {
        this.$nextTick(ele => {
            this.list = [...this.data];
            this.checkedList();
            // console.log('状态管理列表～～～', this.list);
        });
    }
}
</script>

<style lang="less">
@import "../../../../assets/css/base.less";
.state_manage_y {
  position: absolute;
  top: 46px;
  left: 10px;
  box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
  -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
  -moz-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
  -webkit-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
  -moz-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
  width: 160px;
  height: 222px;
  overflow: hidden;
  background: #fff;
  .border_radius(@br: 4px;);
  z-index: 10;
  .list_ul {
    height: 170px;
    overflow: auto;

    li {
      height: 32px;
      line-height: 32px;
      .cur;
      &:hover {
        background: @bg-f2f2f2;
      }

      .header {
        vertical-align: middle;
        margin-left: 14px;
      }
      .names {
        vertical-align: middle;

        margin-left: 10px;
        .dis-in-bl;
        width: 80px;
        .word_over;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #42ac44;
        border: 1px solid #42ac44 !important;
      }
      .el-checkbox__inner {
        border-radius: 50% !important;
        border-color: @bg-f2f2f2 !important;

        &:hover {
          border-color: #42ac44 !important;
        }
      }
    }
    p {
        color: @grayNight;
        text-align: center;
        margin-top: 70px;
    }
  }

  .state_manage_bottom {
    height: 50px;
    border-top: 1px solid @bg-f2f2f2;
    .box_sizing;
    text-align: center;
    button {
        margin-top: 10px;
    }
  }
}
</style>


