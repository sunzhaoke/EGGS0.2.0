<template>
    <div class="state_manage_y">
        <ul class="list_ul">
            <li v-for="(item, index) in list"
                :key="index"
                @click.stop="change(index)">
                <img class="header"
                     :src="item.Images"
                     alt="">
                <span class="names">{{item.Realname}}</span>
                <el-checkbox v-model="item.checked"></el-checkbox>
            </li>
        </ul>
        <div class="state_manage_bottom">
            <button class="main_button_color"
                    @click.stop="allChange">标记全部完成</button>
        </div>
    </div>
</template>
<script>
import { people } from '../data.js';

export default {
    props: ["data"],
    data() {
        return {
            list: [...people],
            defaultKeys: [],
        }
    },
    methods: {
        cancel() {
            // this.$emit('handleManageChange', {});
        },
        allChange() {
            this.list.map(ele => {
                return ele.checked = true;
            });
        },

        change(index) {
            this.list[index].checked = !this.list[index].checked;
        },
        checkedList() {
            let ids = [];
            for (let x of this.list) {
                x.checked && ids.push(x.Pkid);
            }
            this.defaultKeys = ids;
        },


        // 确定当前人数，以及添加或删除的人数
        computedNum() {
            let ids = [];
            for (let x of this.list) {
                (x.checked) && ids.push(x.Pkid);
            }
            if (ids.sort().toString() === this.defaultKeys.sort().toString()) {
                // 人员没用变动
                return null;
            } else {
                // 人员变动：添加/减少
                return ids;

            }
        },
    },
    created() {
        this.checkedList();
    }
}
</script>

<style lang="less">
@import "../../../../../assets/css/base.less";
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
  }

  .state_manage_bottom {
    height: 50px;
    border-top: 1px solid @bg-f2f2f2;
    .box_sizing;
    text-align: center;
  }
}
</style>


