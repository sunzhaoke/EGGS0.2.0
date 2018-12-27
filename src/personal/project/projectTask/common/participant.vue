<template>
    <div class="participant_y">
       <div class="top_search" @click.stop="() => {}">
             <el-input
                placeholder="搜索"
                prefix-icon="el-icon-search"
                size="small"
                v-model="searchValue"
                @input="search"
            >
            </el-input>
       </div>
       <div v-if="list && list.length" class="center_list">
           <div class="all_checked" @click.stop="allChange(allSelected)">
               <i class="iconfont icon-haoyou"></i>
               <span>所有任务成员</span>
               <i v-if="allSelected" class="iconfont icon-xuanzhong"></i>
           </div>
           <ul class="center_ul">
                <li
                    v-for="(item, index) in list"
                    :key="index"
                    @click.stop="change(index)"
                    >
                    <img  class="header" :src="item.image" alt="">
                    <span v-if="item.nickname" class="names">{{item.nickname}}</span>
                    <span v-else class="names">{{item.userName}}</span>
                    <i v-if="item.checked" class="iconfont icon-xuanzhong"></i>
                </li>
            </ul>
       </div>
       <div v-else class="center_list">
           <p v-if="searchValue != ''" class="list_empty">没有搜到～～</p>
           <p v-else class="list_empty">项目中暂无人员，点击<span class="mainColor_text" @click.stop="invitePeople">邀请好友</span>添加人员</p>
       </div>
       <div class="participant_bottom">
           <button class="main_button_" @click.stop="invitePeople">邀请好友</button>
           <button class="main_button_bg" @click.stop="sure">确定</button>
       </div>

       <div class="arrow_div">
           <div class="arrow_box"></div>
       </div>
    </div>
</template>
<script>
import { people } from '../data.js';

export default {
    props: ["creatorId", "defaultKeys", "userList"],
    data() {
        return {
            list: [],
            listCopy: [],
            searchValue: '',
        }
    },
    computed: {
        allSelected() {
            let lists = [...this.list];
            let arr = lists.filter(ele => {
                return ele.checked == true;
            });
            if(!arr.length) {
                return false;
            }
            if(arr.length == this.list.length) {
                return true;
            }
        }
    },
    methods: {
        search(val) {
            let lists = [...this.listCopy];
            this.list = lists.filter(ele => {
                return (ele.userName.indexOf(val) != -1 || ele.nickname.indexOf(val) != -1);
            });
        },
        allChange(all) {
            if(all) {return }
            for(let x = 0; x < this.list.length; x++) {
                this.change(x, true);
            }
            return;
            if(all) {
                for(let x = 0; x < this.list.length; x++) {
                    this.change(x, false);
                }
            }else {
                for(let x = 0; x < this.list.length; x++) {
                    this.change(x, true);
                }
            }
            
        },
        
        change(index, flag) {
            if(flag || flag === false) {
                this.list[index].checked = flag;
            }else {
                this.list[index].checked = !this.list[index].checked;
            }
            if(this.list[index].default) {
                if(!this.list[index].checked) {
                    this.list[index].del = true;
                }else {
                    delete this.list[index].del;
                }
            }else {
                if(this.list[index].checked) {
                    this.list[index].add = true;
                }else if(!this.list[index].checked && this.list[index].add){
                    delete this.list[index].add;
                }
            }
            this.list = this.list.concat();
        },

        invitePeople() {
            let obj = this.computedNum();
            if(obj.add || obj.del) {
                this.$emit('handleSure', obj);
            }
            if(obj.ids) {
                this.$emit("handleInvite", obj.ids);
            }
        },
        sure() {
            let obj = this.computedNum();
            if(obj.add || obj.del) {
                this.$emit('handleSure', obj);
            }else {
                this.$emit('handleSure', undefined);
            }
            
        },

        // 确定当前人数，以及添加或删除的人数
        computedNum() {
            let ids = [], add = [], del = [];
            for(let x of this.list) {
                (x.checked) && ids.push(x.userId);
                if(x.add) {
                    add.push(x.userId);
                }
                if(x.del) {
                    del.push(x.userId);
                }
            }
            return {add: add, del: del, ids: ids}
            
            
        },

        // 获取项目的参与人员
        getProjectPeople() {
            this.list = [...this.userList];
            let indexs = this.list.findIndex(ele => {
                return ele.userId == this.creatorId;
            });
            (indexs != -1) && this.list.splice(indexs, 1);
            this.list.map(ele => {
                return  ele.checked = false;
            });
            for(let id of this.defaultKeys) {
                for(let ele of this.list) {
                    if(ele.userId == id) {
                        ele.checked = true;
                        ele.default = true;
                    }
                    if(ele.add) {
                        delete ele.add;
                    }
                    if(ele.del) {
                        delete ele.del;
                    }
                }
            }
            this.list = this.list.concat();
            this.listCopy = this.list.concat();

        }
    },
    created() {
        this.getProjectPeople();
    }
}
</script>
<style lang="less">
@import "../../../../../assets/css/base.less";
.participant_y {
    position: absolute;
    top: -10px;
    left: 28px;
    box-shadow:0px 1px 8px 0px rgba(59,81,133,0.3);
    -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
    -moz-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
    -webkit-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
    -moz-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
    width: 180px;
    height: 270px;
    background: #fff;
    .border_radius(@br: 4px;);
    z-index: 10;
    .top_search {
        height: 35px;
        line-height: 35px;
        .el-input {
            width: 180px;
            .el-input__inner {
                border: 0px solid #fff;
            }
        }
        
    }
    .center_list {
        border-top: 1px solid @bg-f2f2f2;
        border-bottom: 1px solid @bg-f2f2f2;
        .all_checked {
            height: 32px;
            line-height: 32px;
            .iconfont {
                margin-left: 14px;
                color: @graySix;
            }
            .cur;
            .iconfont {
                color: @mainColor;
                vertical-align: middle;

            }
            span {
                width: 90px;
                display: inline-block;
                text-align: right;
            }
            &:hover {
                background: @bg-f2f2f2;
            }
        }
        .center_ul {
            height: 150px;
            overflow: auto;
            li {
                height: 32px;
                line-height: 32px;
                .header {
                    vertical-align: middle;
                    margin-left: 14px;
                }
                .names {
                    vertical-align: middle;
                    margin-left: 10px;
                    .dis-in-bl;
                    width: 90px;
                    .word_over;
                }
                
                .cur;
                &:hover {
                    background: @bg-f2f2f2;
                }
                .iconfont {
                    color: @mainColor;
                    vertical-align: middle;

                }
            }
        }

        .list_empty {
            color: @grayNight;
            text-align: center;
            height: 182px;
            padding: 60px 10px;
            line-height: 24px;
            .box_sizing;
        }
    }
    .participant_bottom {
        height: 50px;
        line-height: 50px;
        .main_button_ {
            .main_button_unfixed(@mainColor, #fff, #fff);
        }
        button {
            vertical-align: middle;
        }
    }

    .arrow_div {
        position: absolute;
        top: 14px;
        left: -10px;
        width: 10px;
        height: 10px;
        overflow: hidden;
        .arrow_box {
            width: 6px;
            height: 6px;
            box-shadow:0px 1px 8px 0px rgba(59,81,133,0.3);
            -webkit-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
            -moz-box-shadow: inset 0px 1px 8px 0px rgba(59,81,133,0.3);
            -webkit-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
            -moz-box-shadow: 0px 1px 8px 0px rgba(59,81,133,0.3);
            background: #fff;
            transform: rotate(50deg);
            margin-left: 7px;
            margin-top: 2px;
        }
    }
   
}

</style>



