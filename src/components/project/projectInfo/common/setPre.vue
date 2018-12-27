<template>
    <div class="set_pre_y popup">
        <div class="popup_box">
            <div class="popup_top">
                <i v-if="addFlag || graphsFlag" class="iconfont icon-return fl" @click.stop="lastStep"></i>
                <span class="popup_title">设置前置任务</span>
                <i v-if="!addFlag && !graphsFlag" class="iconfont icon-close fr" @click="cancel"></i>
            </div>
            <div class="popup_content">
                <div v-if="preList.length && !addFlag && !graphsFlag" class="pre_list">
                    <ul class="pre_list_ul">
                        <li 
                            class="pre_list_li"
                            v-for="item in preList"
                            :key="item.id"
                            >
                            <img :src="item.Images" alt="" class="header">
                            <span class="titles">{{item.titles}}</span>
                            <span class="from_parths">{{item.fromParth}}</span>
                            <button v-if="item.state === 1" class="tesk_state tesk_state1">已完成</button>
                            <button v-else-if="item.state === 2" class="tesk_state tesk_state2">今日截止</button>
                            <button v-else-if="item.state === 3" class="tesk_state tesk_state3">已超时99+天</button>
                            <button v-else class="tesk_state tesk_state4">11月12日截止</button>

                            <span v-if="item.preType === 1" class="pre_type">等待该任务完成</span>
                            <span v-else-if="item.preType === 2" class="pre_type">等待该任务开始</span>
                            <span v-else-if="item.preType === 3" class="pre_type">等待本任务开始</span>
                            <span v-else class="pre_type">等待本任务完成</span>
                            <span class="mainColor_text" @click="editPre(item)">编辑关系</span>

                        </li>
                    </ul>
                </div>
                <div v-if="addFlag" class="add_list">
                    <div class="pre_search">
                        <el-input
                            placeholder="请输入搜索的任务名称"
                            clearable
                            prefix-icon="el-icon-search"
                            size="small"
                            v-model="searchValue"
                            @input="searchChange"
                            >
                        </el-input>
                    </div>
                    <ul class="pre_list_ul" v-if="searchList.length">
                        <li 
                            class="pre_list_li"
                            v-for="item in searchList"
                            :key="item.id"
                            >
                            <el-checkbox class="pre_checked" v-model="item.checked" @change="addPreChange(item)"></el-checkbox>
                            <img :src="item.Images" alt="" class="header">
                            <span class="titles">{{item.titles}}</span>
                            <span class="from_parths">{{item.fromParth}}</span>
                            <button v-if="item.state === 1" class="tesk_state tesk_state1">已完成</button>
                            <button v-else-if="item.state === 2" class="tesk_state tesk_state2">今日截止</button>
                            <button v-else-if="item.state === 3" class="tesk_state tesk_state3">已超时99+天</button>
                            <button v-else class="tesk_state tesk_state4">11月12日截止</button>

                            <span v-if="item.checked && item.preType === 1" class="pre_type">等待该任务完成</span>
                            <span v-else-if="item.checked && item.preType === 2" class="pre_type">等待该任务开始</span>
                            <span v-else-if="item.checked && item.preType === 3" class="pre_type">等待本任务开始</span>
                            <span v-else-if="item.checked && item.preType === 4" class="pre_type">等待本任务完成</span>
                            <span v-if="item.checked" class="mainColor_text" @click="editPre(item)">编辑关系</span>
                        </li>
                    </ul>
                </div>

                <div v-if="graphsFlag" class="pre_graphs">
                    <div class="graphs_box fl"
                      v-for="item in grahpsList"
                        :key="item.type"
                        >
                            <p class="titles">{{item.name}}</p>
                            <img :src="item.src" alt="">
                            <el-checkbox  class="graphs_checked" v-model="item.checked" @change="typeChange(item)"></el-checkbox>
                    </div>
                </div>
                <div v-if="!preList.length && !addFlag" class="pre_empty">
                    <img src="../../../../../assets/img/pre_empty.png" alt="">
                    <p>还没有设置前置任务，点击<span class="mainColor_text" @click="add">这里</span>添加</p>
                </div>



            </div>
            <div v-if="!addFlag && !graphsFlag" class="popup_bottom">
                <button class="main_button_bg sure fr" @click.stop="add">添加</button>
                <button class="main_button_color fr" @click.stop="cancel">取消</button>
            </div>
            <div v-if="addFlag" class="popup_bottom">
                <button  v-if="addPreList.length" class="main_button_bg sure fr" @click.stop="add">确认添加({{addPreList.length}})</button>
                <button v-else disabled class="main_button_disabled_bg sure fr">确认添加</button>
            </div>
             <div v-if="graphsFlag && !addPreList.length" class="popup_bottom">
                <button class="main_button_unfixed fr" @click.stop="delPre">删除前置关系</button>
            </div>
        </div>
          <!-- 删除温馨提示2 -->
        <transition name="fade1">
            <Reminder2 
            v-if="reminder2Flag"
            :type="1"
            text="您是否确认删除该任务关系"
            @handleCancle="reminderCancel"
            @handleSure="reminderSure"
            />
        </transition>

    </div>
</template>
<script>
import Reminder2 from "../../../../common/reminder2";

import { preList } from '../data.js';
export default {
    components: {
        Reminder2
    },
    data() {
        return {
            listFlag: false,
            graphsFlag: false,
            addFlag: false, 
            preList: [...preList],
            searchList: [],
            searchValue: '',
            selectedType: 1,
            selectedTypeChange: 1,
            selectedItem: null,
            grahpsList: [
                {
                    type: 1,
                    name: '结束 -- 开始',
                    src: require("../../../../../assets/img/pre_type1.png"),
                    checked: true,
                },
                {
                    type: 2,
                    name: '开始 -- 开始',
                    src: require("../../../../../assets/img/pre_type2.png"),
                    checked: false,
                },
                {
                    type: 3,
                    name: '结束 -- 结束',
                    src: require("../../../../../assets/img/pre_type3.png"),
                    checked: false,
                },
                {
                    type: 4,
                    name: '开始 -- 结束',
                    src: require("../../../../../assets/img/pre_type4.png"),
                    checked: false,
                },
                
            ],
            addPreList: [],
            reminder2Flag: false,
        }
    },
    watch: {
        searchValue(val) {
            this.searchList = [];
            if(val) {
                this.searchList = [...preList];
                this.searchList.map(ele => {
                    return  (ele.checked = false) && (delete ele.preType) 
                });
            }else {
                this.searchList = [];
            }
        }
    },
    methods: {
        add() {
            if(this.addPreList.length) { // 确认添加
                // 确认添加， 发送请求
                console.log('确认添加， 发送请求', this.addPreList.length);
                this.searchValue = '';
                this.addPreList = [];
                this.addFlag = false;
                return;
            }
            // 添加
            this.addFlag = true;
        },
        sure() {
            this.$emit('handleSure');
        },
        cancel() {
            this.$emit('handleCancel');
        },
        delPre() {
            this.reminder2Flag = true;
          
        },
        // 取消删除前置任务
        reminderCancel() {
            this.reminder2Flag = false;

        },

        // 确认删除前置任务
        reminderSure() {
            this.reminder2Flag = false;
            this.graphsFlag = false;
            let index = this.preList.findIndex(ele => {
                return ele.id === this.selectedItem.id;
            });
            if(index != -1) {
                this.preList.splice(index, 1);
                // 发送请求
                console.log('删除前置任务，发送请求');
            }
           
        },
        lastStep() {
            if(this.addPreList.length) {
                if(this.graphsFlag) { // 回到添加页面
                    this.graphsFlag = false;
                    this.addFlag = true;
                    if(this.selectedTypeChange == this.selectedType) {
                        console.log('add-前置任务未发生改变');
                    }else {
                        console.log('add-前置任务发生改变');
                        this.selectedType = this.selectedTypeChange;
                        this.selectedItem.preType = this.selectedType;
                        for(let x of this.searchList) {
                            if(x.id === this.selectedItem.id) {
                                x.preType = this.selectedType;
                            }
                        }
                    }

                }else { // 回到列表页面
                    this.graphsFlag = false;
                    this.addFlag = false;
                    this.addPreList = [];
                    this.searchValue = '';
                }
                
                return;
            }
           
            if(this.addFlag) {  // 回到列表页面
                this.addFlag = false;
            }else if(this.graphsFlag) { // 回到列表页面
                this.graphsFlag = false;
                if(this.selectedTypeChange == this.selectedType) {
                    console.log('前置任务未发生改变');
                }else {
                    console.log('前置任务发生改变，发送请求');
                    this.selectedType = this.selectedTypeChange;
                    this.selectedItem.preType = this.selectedType;
                    for(let x of this.preList) {
                        if(x.id === this.selectedItem.id) {
                            x.preType = this.selectedType;
                        }
                    }
                }
            }
        },

        editPre(item) {
            this.addFlag = false;
            this.graphsFlag = true;
            this.selectedItem = item;
            this.selectedType = item.preType;
            this.selectedTypeChange = item.preType;
            this.grahpsList.map(ele => {
                if(ele.type == this.selectedType) {
                    return ele.checked = true;
                }else {
                    return ele.checked = false;
                }
            });
            

        },

        typeChange(item) {
            console.log(item.checked);
            if(!item.checked) {
                item.checked = true;
                return;
            }
            this.selectedTypeChange = item.type;
            for(let x of this.grahpsList) {
                if(x.type != item.type) {
                    x.checked = false;
                }
            }
            
        },

        searchChange(val) {
            this.searchValue = val;
        },

        addPreChange(item) {
            if(item.checked) { // add
                item.preType = 1;
                this.addPreList.push(item);

            }else { // del
                let index = this.addPreList.findIndex(ele => {
                    return ele.id == item.id;
                });
                if(index != -1) {
                    delete item.preType
                    this.addPreList.splice(index, 1);
                }
            }
        },

        editList() {
            this.preList.map(ele => ele.checked = false);
        },

    },
    created() {
        // this.editList();
    }
}
</script>
<style lang="less">
@import "../../../../../assets/css/base.less";
.set_pre_y {
    .popup_box {
        width: 800px;
    }
    .popup_content {
        width: 800px;
        height: 415px;
        position: relative;
        .pre_empty {
            width: 800px;
            min-height: 100px;
            text-align: center;
            img {
                margin-top: 73px;
                margin-bottom: 50px;
            }
            p {
                margin-bottom: 60px;
            }
        }

        .pre_list, .add_list {
           padding: 10px 24px;
           padding-right: 10px;
           height: 100%;
            .box_sizing;
            .pre_list_ul {
                height: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                .pre_list_li {
                    width: 752px;
                    height: 40px;
                    line-height: 40px;
                    .pre_checked {
                        margin-left: 10px;
                    }
                    span {
                        vertical-align: middle;
                    }
                   
                    .header {
                        margin-left: 20px;
                    }
                    .titles {
                        .dis-in-bl;
                        margin-left: 14px;
                        width: 160px;
                        .word_over;
                    }
                    .from_parths {
                        font-weight: bold;
                        .dis-in-bl;
                        margin-left: 24px;
                        width: 123px;
                        .word_over;
                    }
                    .tesk_state {
                        font-size: 12px;
                        padding: 0 !important;
                        width: 90px;
                        text-align: center;
                        margin: 0;
                        margin-left: 30px;
                        .word_over;
                    }
                    .tesk_state1 {
                        .main_button_unfixed(#169a19, #ECFFED, #ECFFED);
                    }
                    .tesk_state2 {
                        .main_button_unfixed(#EA3F33, #F7F7F7, #F7F7F7);
                    }
                    .tesk_state3 {
                        .main_button_unfixed(#EA3F33, #FFE8E6, #FFE8E6);
                    }
                    .tesk_state4 {
                        .main_button_unfixed(#999999, #F7F7F7, #F7F7F7);
                    }

                    .pre_type {
                        margin-left: 24px;
                    }
                    .mainColor_text {
                        margin-left: 20px;
                    }
                    &:hover {
                        background: @bg-f2f2f2;
                    }
                }
            }
        }

        .pre_list {
            .pre_type {
                margin-left: 50px;
                margin-right: 10px;
            }
        }
        .add_list {
            .pre_search {
                margin-bottom: 10px;
                .el-input {
                    width: 750px;
                }
            }
        }

        .pre_graphs {
            width: 100%;
            height: 100%;
            overflow: hidden;
            .graphs_box {
                width: 50%;
                height: 50%;
                .box_sizing;
                text-align: center;
                position: relative;
                p {
                  margin-top: 24px;
                }
                img {
                    margin: 50px auto;
                }
                .graphs_checked {
                    position: absolute;
                    right: 30px;
                    bottom: 20px;
                    .el-checkbox__inner {
                        width: 28px;
                        height: 28px;
                        .border_radius(@br: 50%;);
                        &::after {
                            width: 6px;
                            height: 14px;
                            left: 10px;
                            top: 4px;
                        }
                    }
                }
                &:first-of-type {
                    border-right: 1px solid @bg-f2f2f2;
                    border-bottom: 1px solid @bg-f2f2f2;
                }
                &:last-of-type {
                    border-left: 1px solid @bg-f2f2f2;
                    border-top: 1px solid @bg-f2f2f2;
                }
            }
        }
    }
    .popup_bottom {
      height: 70px;
      line-height: 71px;
      border-top: 1px solid @bg-f2f2f2;

      .invite {
        color: @mainColor;
        margin-left: 26px;
        .cur;
        &:hover {
          color: @mainHover;
          text-decoration: underline;
        }
      }

      button {
        margin-top: 20px;
      }

      .sure {
        margin-right: 26px;
        margin-left: 20px;
      }
      .main_button_unfixed {
        .main_button_unfixed(#EA3F33, #EA3F33, #fff);
        margin-right: 24px;
      }
    }
   
}
</style>


