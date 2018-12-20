<template>
    <div class="task_filter" id="taskFilter">
        <div class="time">
            <span class="names">开始时间</span>

            <el-date-picker
              class="el_time"
              v-model="obj.startTime"
              prefix-icon="el-icon-date"
              :range-separator="rangeSeparatorStart"
              @change="startChange"

              type="daterange"

              >
                <i class="iconfont icon-rili"></i>

            </el-date-picker>
            
        </div>
         <div class="time">
            <span class="names">截止时间</span>
             <el-date-picker
              class="el_time"
              v-model="obj.endTime"
              prefix-icon="el-icon-date"
              :range-separator="rangeSeparatorEnd"
              @change="endChange"
              type="daterange"
              >
                <i class="iconfont icon-rili"></i>
            </el-date-picker>

        </div>
        <div class="state">
            <span class="name">任务状态</span>
             <ul class="state_list">
                <li 
                class="state_type fl"
                v-for="(item, index) in filterTypes"
                :key="item.type"
                >
                <span 
                :class="obj.state === item.type ? 'selected_color state_name' : 'state_name'"
                    @click="filterClick(index)"
                    >{{item.label}}
                </span><span v-if="index < filterTypes.length - 1 " class="point"></span>

                </li>
            </ul>
        </div>

        <div class="peoples">
            <span class="names">创建人</span>
            <el-select v-model="obj.selectedCreated">
                <el-option
                v-for="item in createdPeople"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>

        <div class="peoples peoples2">
            <span class="names">参与人</span>
            <el-select v-model="obj.selectedAdd">
                <el-option
                v-for="item in addPeople"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="buttons">
            <button class="main_button_bg fr" @click="sure">确定</button>
            <button class="main_button_ fr" @click="reset">重置</button>
        </div>
        <div class="arrow_div">
          <div class="arrow_box"></div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["filtersObj"],
  data() {
    return {
      obj: {},
      filterTypes: [
        { type: 0, label: "已超时" },
        { type: 1, label: "未完成" },
        { type: 2, label: "已完成" },
        { type: 3, label: "全部" }
      ], // 过滤列表
      createdPeople: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "02",
          label: "祝建云"
        },
        {
          value: "03",
          label: "赵珂"
        },
        {
          value: "04",
          label: "卢洪臣"
        },
        {
          value: "05",
          label: "罗建鹏"
        }
      ],
      addPeople: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "02",
          label: "祝建云"
        },
        {
          value: "03",
          label: "赵珂"
        },
        {
          value: "04",
          label: "卢洪臣"
        },
        {
          value: "05",
          label: "罗建鹏"
        }
      ],
      rangeSeparatorStart: ' ',
      rangeSeparatorEnd: ' ',
    };
  },
  methods: {
    // 点击过滤状态
    filterClick(index) {
      this.obj.state = index;
      
    },

    // 开始时间变化
    startChange(val) {
      // console.log(val, this.obj.startTime);
      // if(val[0].toString() === val[1].toString()) {
      if(val) {
        this.rangeSeparatorStart  = '-';
      }else {
        this.rangeSeparatorStart = '';
      }
    },

    // 结束时间变化
    endChange(val) {
      if(val) {
        this.rangeSeparatorEnd = '-';
      }else {
        this.rangeSeparatorEnd = '';
      }
    },
    // 确定
    sure() {
        this.$emit('cancelFilters', this.obj);
    },
    // 重置
    reset() {
      this.obj.startTime = '';
      this.obj.endTime = '';
      this.obj.state = 3;
      this.obj.selectedCreated = '';
      this.obj.selectedAdd = '';
      this.$emit('cancelFilters', this.obj);
    }
  },
  mounted() {
    this.obj = Object.assign({}, this.filtersObj);
    this.startChange(this.obj.startTime);
    this.endChange(this.obj.endTime);
  }
};
</script>

<style lang="less">
@import "../../../assets/css/base.less";
.task_filter {
  position: absolute;
  right: 0;
  top: 53px;
  width: 550px;
  height: 0px;
  padding: 0px 24px;
  .box_sizing;
  .border_radius(@br: 4px;);
  background: #fff;
  -webkit-box-shadow: inset 0px 1px 8px 0px rgba(126, 126, 126, 0.6);
  -moz-box-shadow: inset 0px 1px 8px 0px rgba(126, 126, 126, 0.6);
  -webkit-box-shadow: 0px 1px 8px 0px rgba(126, 126, 126, 0.6);
  -moz-box-shadow: 0px 1px 8px 0px rgba(126, 126, 126, 0.6);
  box-shadow: 0px 1px 8px 0px rgba(126, 126, 126, 0.6);
  background: #fff;
  z-index: 10;
  .time {
    height: 30px;
    line-height: 30px;

    .names {
      vertical-align: middle;
    }

    .el_time {
      border: none;
        height: 30px;
        line-height: 33px;
        vertical-align: middle;
      position: relative;
      width: 300px;
      height: 30px;
      .icon-rili {
        font-size: 14px;
        position: absolute;
        left: 10px;
        top: 4px;
      }

      .el-input__icon, .el-range-separator {
        line-height: 24px;
        margin-top: -2px;
      }
        
      .el-input__prefix {
        color: #333;
        .el-input__icon {
          // line-height: 33px;
        }

        .cur;
        &:hover {
          color: @mainHover;
        }
        // display: none;
      }

      .el-input__suffix {
        .el-input__icon {
          // line-height: 33px;
        }
      }
    }
  }

  .state {
    height: 30px;
    line-height: 30px;
    .name {
      vertical-align: middle;
    }
    .state_list {
      vertical-align: middle;
      display: inline-block;
      margin-left: 10px;
      .filter_type {
        .cur;
        .selected_color {
          color: @mainColor;
        }

        .state_name {
          color: @graySix;
        }

        .point {
          .dis-in-bl;
          width: 4px;
          height: 4px;
          .border_radius(@br: 50%;);
          background: #d0d0d0;
          margin: 0 7px;
          vertical-align: middle;
        }
      }
    }
  }

  .peoples {
      display: inline-block;
      margin-top: 5px;
      height: 32px;
      line-height: 32px;
     
      .el-select {
          margin-left: 25px;
          .el-input__inner {
              height: 32px;
          }
          .el-input__suffix .el-input__icon {
            line-height: 33px;
          }
        .el-input {
            width: 135px;
            .is-focus .el-input__inner {
            border-color: #dcdfe6;
        }
        }
      }
  }

  .peoples2 {
          margin-left: 60px;

  }

  .buttons {
      height: 30px;
      margin-top:10px;
      .main_button_ {
        .main_button_unfixed(@grayNight, #fff, #fff);
      }
  }

  .arrow_div {
    position: absolute;
    top: -10px;
    left: 274px;
    width: 12px;
    height: 12px;
    overflow: hidden;
    .arrow_box {
        width: 8px;
        height: 8px;
        box-shadow:0px 1px 8px 0px rgba(59,81,133,0.3);
        -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
        -moz-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
        -webkit-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
        -moz-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
        background: #fff;
        transform: rotate(45deg);
        margin-top: 7px;
    }
  }


}
.el-select-dropdown__item.selected {
    color: @mainColor;
}
</style>

