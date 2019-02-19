<template>
    <div class="add_time_yun">
        <div class="stage_time_box">
            <div 
                class="stage_time_list"
                v-for='(stage, index) in stageTimeList'
                :key='stage.stageId'
                >
                <span class="names">{{stage.stageTitle}}</span>
                <el-date-picker
                    class="el_time"
                    popper-class="stage_time"
                    v-model="stage.timeRange"
                    type="datetimerange"
                    align="right"
                    start-placeholder="请设置时间"
                    :range-separator="stage.rangeSeparator"
                    :default-time="['08:00:00', '18:00:00']"
                    format="MM/dd HH:mm"
                    :clearable="false"
                    prefix-icon='el-icon-date'
                    @change="timeChange($event, stage)"
                    >
                </el-date-picker>
                <!-- <el-date-picker
                class="el_time"
                v-model="stage.startTime"
                prefix-icon="el-icon-date"
                :range-separator="stage.rangeSeparator"
                @change="timeChange($event, stage)"
                type="daterange"
                >
                    <i class="iconfont icon-rili"></i>

                </el-date-picker> -->
                <div v-if='!index' class="selected_stage"></div>
            </div>
        </div>
        <div class="arrow_div">
            <div class="arrow_box"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["defaultList", "ids", "fullViewFlag"],
    data() {
        return {
            stageTimeList: [],
        }
    },
    methods: {
        timeChange(val, item) {
            if(val) {
                item.rangeSeparator = '-';
            }else {
                item.rangeSeparator = ' ';
            }
            let obj = {
                stageId: item.stageId,
                taskId: this.ids.taskId,
                startTime: val ? this.format(val[0]) : '',
                endTime: val ? this.format(val[1]) : '',
                myUserId: this.ids.userId,
            };
            this.$HTTP("post", "/stageTask_date_update", obj)
            .then(res => {
                // console.log("任务修改时间成功", res.result);
                res.result.stageId = res.result.stageId.toString();
                let data = {
                    item: res.result,
                    del: [],
                    add: []
                }
                this.$emit('stageInfoChange', 2, data);
            })
            .catch(err => {
                console.log("任务修改时间失败", err);
            });
            this.stageTimeList = this.stageTimeList.concat();
        },
        setData() {
            this.stageTimeList = [...this.defaultList];
            if(!this.fullViewFlag) {
                let indexs = this.stageTimeList.findIndex( ele => ele.stageId == this.ids.stageId);
                if(indexs > 0) {
                    let list = this.stageTimeList[indexs];
                    this.stageTimeList.splice(indexs, 1);
                    this.stageTimeList.unshift(list);
                }
            }
            for(let x of this.stageTimeList) {
                this.$set(x, 'rangeSeparator', x.startTime ? '-' : ' ');
                this.$set(x, 'timeRange', [new Date(x.startTime), new Date(x.endTime)]);
            }
            
         
        }
    },
    created() {
        this.setData();
        console.log("addTime---", this.stageTimeList);
    }
}
</script>
<style lang='less'>
@import "../../../../assets/css/base.less";

.add_time_yun {
    position: absolute;
    top: 35px;
    left: -206px;
    width: 380px;
    max-height: 290px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 15px 0px rgba(59, 81, 133, 0.3);
    border-radius: 4px;
    z-index: 11;
    .stage_time_box {
        width: 100%;
        max-height: 290px;
        padding: 10px 0 10px 24px;
        overflow-y: auto;
        .box_sizing;

        .stage_time_list {
            width: 100%;
            height: 30px;
            line-height: 30px;
            margin: 10px 0;
            position: relative;
            .names {
            vertical-align: middle;
            }

            .el_time {
            border: none;
                height: 30px;
                line-height: 33px;
                vertical-align: middle;
            position: relative;
            width: 280px;
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

            &:first-child {
                margin-bottom: 20px;
            }
        }
        .selected_stage {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 336px;
          height: 1px;
          background: @line;
        }
    }


    .arrow_div {
        position: absolute;
        top: -10px;
        left: 228px;
        width: 10px;
        height: 10px;
        overflow: hidden;
        .arrow_box {
        width: 6px;
        height: 6px;
        box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        -moz-box-shadow: inset 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        -webkit-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        -moz-box-shadow: 0px 1px 8px 0px rgba(59, 81, 133, 0.3);
        background: #fff;
        transform: rotate(45deg);
        margin-left: 2px;
        margin-top: 7px;
        }
    }
  

}
</style>


