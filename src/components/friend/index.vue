<template>
    <div class="friend_management">
        <div class="friend_m_top">好友管理</div>
        
        <div class="friend_m_center">
            <div v-if="friendList.length" class="friend_content">
                <div class="friend_group">
                    <div class="friend_group_top _top">
                        <span class="fl">好友分组</span>
                        <el-dropdown v-if="!checkedList.length" class="frined_jia fr">
                            <i class="iconfont icon-jia1"></i>
                            <el-dropdown-menu slot="dropdown" >
                                <el-dropdown-item command="add_friend" @click.native="adds('add_friend')">添加好友</el-dropdown-item>
                                <el-dropdown-item command="add_group" @click.native="adds('add_group')">添加分组</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <div v-else class="batch_operate fr">
                            <button class="main_button_color" @click.stop="batchRemove">批量移动</button>
                            <button class="main_button_color" @click="addUsed">添加到常用联系人</button>
                            <el-collapse-transition>
                                <ul v-if="batchRemoveFlag" class="remove_group">
                                    <li
                                        v-for="(item, index) in friendList"
                                        :key="index"
                                        @click="removeGroup(index, item.pkid)"
                                    >
                                        {{item.groupName}}
                                    </li>
                                </ul>
                            </el-collapse-transition>
                        </div>
                    </div>

                    <div class="friend_group_content">
                        <div 
                            class="friend_group_list"
                            v-for="(item, index1) in friendList"
                            :key="item.pkid"
                            >
                            <div class="friend_group_list_top" @mouseenter="listEnter(index1)">
                                <i class="iconfont icon-unfold" :class="item.extend ? '' : 'icon-unfold_rotate'" @click="extendClick(index1, item.extend)"></i>
                                <span class="span_title">{{item.groupName}}({{item.friendsListCont}})</span>
                                <el-dropdown v-if="item.pkid != 0" class="frined_more fr" @visible-change="visibleChange">
                                    <i class="iconfont icon-gengduo"></i>
                                    <el-dropdown-menu slot="dropdown" >
                                        <el-dropdown-item 
                                            command="remarks" 
                                            @mouseenter.native="otherMouseEnter" 
                                            @click.native="command1('remarks', item)"
                                            >修改组名</el-dropdown-item>
                                        <el-dropdown-item 
                                            v-if="friendList.length - 1"
                                            class="parth_el_dropdown_move" 
                                            command="move" 
                                            @click.native="command1('move')"
                                            @mouseenter.native="moveMouseEnter('group')"
                                            >
                                            <span class="parth_el_dropdown_span">移动分组</span>
                                            <i class="iconfont icon-enter"></i>
                                            <ul  
                                                v-if="moveGroupShow" 
                                                class="move_parths move_group2_left"
                                                >
                                                <draggable 
                                                    element="ul" 
                                                    v-model="groupList"
                                                    @end="dragEndParth"
                                                    @start="dragStartParth(0, $event)"
                                                    >
                                                    <li
                                                    v-for="x in groupList"
                                                    :key="x.pkid"
                                                    v-if="x.pkid != 0"
                                                    >
                                                        <span>{{x.groupName}}</span>
                                                        <i class="iconfont icon-Shapex"></i>
                                                    </li>
                                                </draggable>
                                            </ul>

                                        </el-dropdown-item>
                                        <el-dropdown-item 
                                            v-if="friendList.length >= 2"
                                            command="delete" 
                                            @mouseenter.native="otherMouseEnter"  
                                            @click.native="command1('delete', item)"
                                            >删除分组</el-dropdown-item>
                                    
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <ul class="friend_group_list_every">
                                <li
                                    v-for="(ele, index2) in item.friendsList"
                                    :key="ele.pkid"
                                     class="friend_group_list_li"
                                      @mouseenter="listEnter(index1, index2)"
                                    >
                                    <el-checkbox 
                                        v-model="ele.checked" 
                                        :class="ele.checked ? 'visibility' : ''"
                                        @change="selectChange(ele)"
                                        >
                                    </el-checkbox>
                                    <img :src="ele.Images" alt="" class="header">
                                    <span v-if="ele.nickName" class="names">{{ele.nickName}}<span class="names_real">({{ele.userName}})</span></span>
                                    <span v-else class="names">{{ele.userName}}</span>
                                    <el-dropdown class="frined_more fr" @visible-change="visibleChange">
                                        <i class="iconfont icon-gengduo"></i>
                                        <el-dropdown-menu slot="dropdown" >
                                            <el-dropdown-item 
                                                command="remarks" 
                                                @mouseenter.native="otherMouseEnter" 
                                                @click.native="command2('remarks', ele)"
                                                >备注姓名</el-dropdown-item>
                                            <el-dropdown-item 
                                                v-if="friendList.length - 1"
                                                class="parth_el_dropdown_move" 
                                                command="move" 
                                                @click.native="command2('move', ele)"
                                                @mouseenter.native="moveMouseEnter()"
                                                >
                                                <span class="parth_el_dropdown_span">移动分组</span>
                                                <i class="iconfont icon-enter"></i>
                                                <ul  
                                                    v-if="moveGroupShow" 
                                                    class="move_parths move_group2"
                                                    :class="ele.isUsed ? 'move_group2_left' : ''"

                                                    >
                                             
                                                    <li
                                                    v-for="x in groupList"
                                                    :key="x.pkid"
                                                    @click="moveGroup2(x.pkid, ele)"
                                                    >
                                                        <span>{{x.groupName}}</span>
                                                    </li>
                                                </ul>

                                            </el-dropdown-item>
                                            <el-dropdown-item 
                                                v-if="!ele.isUsed"
                                                command="add_used" 
                                                @mouseenter.native="otherMouseEnter"  
                                                @click.native="command2('add_used', ele)"
                                                >添加到常用联系人</el-dropdown-item>
                                        
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </li>
                            </ul>
                            
                        </div>
                    </div>
                </div>
                <div class="friend_used">
                    <div class="friend_used_top _top">常用联系人</div>
                    <ul v-if="usedList.length" class="friend_used_list">
                        <li
                            v-for="(item, index) in usedList"
                            :key="item.pkid"
                            
                            >
                            <div class="li_box">
                                <img :src="item.Images" alt="" class="header">
                                <span class="names">{{item.userName}}</span>
                                <i class="iconfont icon-close" @click="delUsed(index, item.pkid)"></i>
                            </div>

                        </li>
                    </ul>
                    <div v-else class="used_empty"><p>点击左侧好友列表添加常用联系人</p></div>
                </div>
            </div>
            <div v-else class="friend_empty">
                <img src="../../assets/img/noBody1.png" alt="">
                <p>您还没有好友，<span class="mainColor_text" @click="addFriend">点击这里</span> 去添加好友</p>
            </div>
        </div>

        <!-- 邀请好友 -->
        <transition name="fade1">
        <add-people 
            v-if="inviteFlag"
            :invite="true"
            :defaultTreeKeys="[]"
            @handleCancel="inviteCancel"
            @handleInvite="emailInvite"
            :fromInfo="{fromType: 0, id: ''}"
        />
        </transition>


        <!-- 添加分组 -->
        <transition name="fade1">
        <Reminder2
            v-if="addGroupFlag"
            type="添加分组"
            :text="reminderText"
            @handleCancle="reminderCancel1"
            @handleSure="reminderSure1"
        />
        </transition>

        <!-- 修改分组名称 -->
        <transition name="fade1">
        <Reminder2
            v-if="editGroupFlag"
            type="修改分组"
            text="请输入分组名"
            :inputValue="inputValue"
            @handleCancle="reminderCancel2"
            @handleSure="reminderSure2"
        />
        </transition>

        <!-- 删除分组 -->
        <transition name="fade1">
        <Reminder2 
            v-if="delGroupFlag"
            :type="1"
            :text="reminderText"
            :selectList="selectList"
            @handleCancle="delGroupCancel"
            @handleSure="delGroupSure"
          />
        </transition>

        <!-- 设置备注姓名 -->
        <transition name="fade1">
        <Reminder2
            v-if="remarskFlag"
            type="设置备注姓名"
            text="请输入备注姓名"
            :inputValue="inputValue"
            @handleCancle="remarsCancel"
            @handleSure="remarsSure"
         />
        </transition>

    </div>
</template>
<script>
import draggable from "vuedraggable";

import AddPeople from '../common/addPeople';
import Reminder2 from '../common/reminder2';

export default {
    components: {
        draggable,

        AddPeople,
        Reminder2
    },
    data() {
        return {
            userId: JSON.parse(localStorage.getItem('staffInfo')).userPkid,
            friendList: [], // 好友树状图列表
            usedList: [], // 常用联系人列表
            groupList: [], // 移动分组
            inviteFlag: false, // 邀请好友列表
            moveGroupShow: false,
            nowIndex: [0, undefined], 
            addGroupFlag: false, 
            editGroupFlag: false,
            delGroupFlag: false,
            remarskFlag: false,
            reminderText: '',
            inputValue: '',
            selectList: [],
            checkedList: [],
            batchRemoveFlag: false,
            oldIndex: 0

        }
    },
    watch: {
        checkedList: {
            handler(val) {
                console.log(val);
            },
            deep: true
        }
    },
  
    methods: {
        // 点击这里邀请好友
        addFriend() {
            this.inviteFlag = true;
        },

        // 邀请好友弹框消失
        inviteCancel() {
            this.inviteFlag = false;
        },

        // 发送又想邀请的回调函数
        emailInvite(list) {
            return
            console.log('---emailInvite', list);
            let obj = {
                emailList: list.join(','),
                myUserId: this.userId,
                type: 0,
                id: 0
            }
            this.$HTTP('post', '/user_invitationEmail', obj).then(res => {
                console.log('邮箱发送邀请成功', res);
            }).catch( err => {
                console.log('邮箱发送邀请失败', err);
            });
        },

        // 获取当前选择的ID
        listEnter(index1, index2) {
            this.nowIndex = [index1, index2];

        },

        // 选中状态
        selectChange(item) {
            let i = this.checkedList.findIndex(ele => {
                return ele.pkid == item.pkid;
            });
            if(i == -1 && item.checked) {
                this.checkedList.push(item);
            }else if(i != -1 && !item.checked) {
                this.checkedList.splice(i, 1);
            }
        },

        // 批量移动
        batchRemove() {
            this.batchRemoveFlag = true;
            let clickHide = e => {
                this.batchRemoveFlag = false; // 隐藏
                $(document).unbind("click", clickHide)
            };
            $(document).bind("click", clickHide)

        },

        // 批量移动到某组中
        removeGroup(index, id) {
            let ids = [];
            for(let i of this.checkedList) {
                ids.push(i.pkid);
            }
            this.updateGroup(ids, id).then(res => {
                for(let x = 0; x < this.friendList.length; x++) {
                    for(let y = 0; y < this.friendList[x].friendsList.length; y++) {
                        if(this.friendList[x].friendsList[y].checked) {
                            let has = this.friendList[index].friendsList.findIndex(ele => {
                                return ele.pkid == this.friendList[x].friendsList[y].pkid
                            });
                            if(has == -1) {
                                this.friendList[index].friendsList.push(this.friendList[x].friendsList[y]);
                                this.friendList[x].friendsList[y].checked = false;
                                this.friendList[x].friendsList.splice(y, 1);
                                this.friendList[x].friendsListCont = this.friendList[x].friendsList.length;
                                this.friendList[index].friendsListCont = this.friendList[index].friendsList.length;
                                if(!this.friendList[index].extend) {
                                    this.friendList[index].extend = true;
                                    $('.friend_group_list_every').eq(index).slideDown(400);
                                }
                                y--;
                            }else {
                                this.friendList[x].friendsList[y].checked = false;
                            }
                        }
                    }
                }
                this.friendList = [...this.friendList];
                this.checkedList = [];

            }).catch(err => {
                console.log('async---err', err);
            });
        },

        // 批量添加到常用联系人
        addUsed() {
            for(let x of this.friendList) {
                for(let y of x.friendsList) {
                    if(y.checked && !y.isUsed) {
                        this.usedList.push(y);
                        y.isUsed = true;
                    }
                    y.checked = false;

                }
            }
            this.checkedList = [];

        },

        // 更多操作的显示隐藏
        visibleChange() {
            this.moveGroupShow && (this.moveGroupShow = false);
        },

        // 好友分组的更多操作
        adds(command) {
            if(command == 'add_friend') { // 添加好友
                this.addFriend();

            }else if(command == 'add_group') { //添加分组
                this.reminderText = '请输入分组名';
                this.addGroupFlag = true;
               
            }
        },


        // 添加分组
        reminderCancel1() {
            this.addGroupFlag = false;
        },
        reminderSure1(value) {
            this.addGroupFlag = false;
            let obj = {
                myUserId: this.userId,
                title: value
            }
            this.$HTTP('post', '/user_friends_group_add', obj).then( res => {
                let result = res.result;
                let data = {
                    pkid: result.Pkid,
                    groupName: result.Title,
                    friendsListCont: 0,
                    friendsList: [],
                    extend: true,
                };
                this.friendList.push(data);
                console.log('添加分组', res);
            }).catch( err => {
                console.log('添加分组失败', err);
            });
        },

        // 删除常用联系人
        delUsed(index, id) {
            this.usedList.splice(index, 1);
            for(let x of this.friendList) {
                for(let y of x.friendsList) {
                    if(y.pkid == id) {
                        y.isUsed = false;
                    }
                }
            }
            this.friendList = [...this.friendList];
            // 发送请求
        },

        // 分组展开收起
        extendClick(index, flag) {
            this.friendList[index].extend = !this.friendList[index].extend;
            this.friendList = [...this.friendList];
            $('.friend_group_list_every').eq(index).slideToggle(400);
        },


        // 每组的更多操作
        command1(command, item) {
            let x = this.nowIndex;
            this.selectList = [];
            if(command == 'remarks') { // 修改组名
                this.editGroupFlag = true;
                this.inputValue = item.groupName;

            }else if(command == 'mvoe') { // 移动分组

            }else if(command == 'delete') { // 删除分组
                this.delGroupFlag = true;
                if(item.friendsList.length) {
                    for(let ele of this.friendList) {
                        this.selectList.push({
                            value: ele.pkid,
                            label: ele.groupName,
                            disabled: false
                        });
                    }
                    this.selectList[x[0]].disabled = true;
                    this.reminderText = '该分组内已有好友，在删除该分组前，请选择将好友移动到其他分组';

                }else {
                    this.reminderText = '您是否确认删除该分组？删除后不可恢复';
                }

            }
        },


        // 修改分组名
        reminderCancel2() {
            this.editGroupFlag = false;
        },
        reminderSure2(val) {
            this.editGroupFlag = false;
            if(val == this.inputValue) {
                // 分组名未改变，不需要发送请求
            }else {
                // 分组名发生改变，发送请求
                console.log('新的分组名', val);
                let x = this.nowIndex;
                let obj = {
                    friends_grouId: this.friendList[x[0]].pkid,
                    title: val
                };
                this.$HTTP('post', '/user_friends_group_update', obj).then(res => {
                    console.log('修改组名', res);
                    this.friendList[x[0]].groupName = val;

                }).catch( err => {
                    console.log('修改组名失败', err);
                });
            }
        },
        
        
        // 移动分区开始
        dragStartParth(x, e) {
            if(e) {
                this.oldIndex = e.oldIndex + 1;
            }
            for(let i = x; i < this.friendList.length; i++) {
                this.friendList[i].extend = false;
                this.$nextTick(() => {
                    $('.friend_group_list_every').eq(i).slideUp(400);
                });
            }
        },

        // 移动分区结束
        dragEndParth(e) {
            let x = this.nowIndex;
            let obj = {
                friends_grouId: this.friendList[this.oldIndex].pkid,
                isSort: e.newIndex 
            }
            this.$HTTP('post', '/user_friends_group_update_isSort', obj).then(res => {
                console.log('移动分区成功', res);
                this.friendList = [...this.groupList];

            }).catch(err => {
                console.log('移动分区失败', err);
            });

        },

        // 删除分组--取消
        delGroupCancel() {
            this.delGroupFlag = false;

        },
        // 删除分组--确定
        delGroupSure(val) {
            let x = this.nowIndex[0];
            let list = [...this.friendList];
            let delId = list[x].pkid;

            if( val === '') {
                this.delGroupHttp(delId).then(res => {
                    list.splice(x, 1);
                    this.friendList = [...list];
                }).catch(err => {
                    console.log(err);
                });
                
            }else {
                let index = list.findIndex(ele => ele.pkid == val);
                if(index != -1) {
                    list[index].friendsList = list[index].friendsList.concat(list[x].friendsList);
                    list[index].friendsListCont = list[index].friendsList.length;
                    if(!list[index].extend) {
                        list[index].extend = true;
                        $('.friend_group_list_every').eq(index).slideDown(400);
                    }
                    let ids = [];
                    for(let i of list[x].friendsList) {
                        ids.push(i.pkid);
                    }
                    this.updateGroup(ids, list[index].pkid).then(res => {
                        this.delGroupHttp(delId).then(res => {
                            list.splice(x, 1);
                            this.friendList = [...list];
                        }).catch(err => {
                            console.log(err);
                        });

                    }).catch(err => {
                        console.log(err);
                    });
                    
                    
                }
            }
            
            
            


        },
        // 删除请求
        async delGroupHttp(id) {
            return new Promise((resolve, reject) => {
                let obj = {
                    friendsGroupId: id
                };
                this.$HTTP('post', '/user_friendsGroup_delete', obj).then(res => {
                    resolve(res);
                    this.delGroupFlag = false;

                }).catch(err => {
                    this.$message.error('删除好友分组失败，请检查网络');
                    reject(err);
                });
            });
            
        },
        


        // 每个人的更多操作
        command2(command, ele) {
            let x = this.nowIndex;
            if(command == 'remarks') { // 备注姓名
                this.remarskFlag = true;
                this.inputValue = ele.nickName;

            }else if(command == 'mvoe') { //移动分组

            }else if(command == 'add_used') { //添加到常用联系人
                this.usedList.push(ele);
                this.friendList[x[0]].friendsList[x[1]].isUsed = true;
            }
        },

        moveMouseEnter(val) {
            let x = this.nowIndex;
            this.groupList = [];
            if(val) {
                this.groupList = this.friendList.concat();
            }else {
                for(let a in this.friendList) {
                    a = Number(a);
                    if(a != x[0]) {
                        this.groupList.push(this.friendList[a]);
                        
                    }
                }
            }

            this.moveGroupShow = true;

        },

        otherMouseEnter() {
            this.moveGroupShow = false;

        },
        
        // 备注姓名
        remarsCancel() {
            this.remarskFlag = false;
        },
        remarsSure(val) {
            let x = this.nowIndex;
            this.remarskFlag = false;
            let obj = {
                friendsId: this.friendList[x[0]].friendsList[x[1]].pkid,
                nickName: val
            };
            this.$HTTP('post', '/user_friends_update_nickname', obj).then(res => {
                console.log('修改备注名', res);
                this.friendList[x[0]].friendsList[x[1]].nickName = val;

            }).catch( err => {
                console.log('修改备注名失败', err);
            });
        },


        // 个人移动分组
        moveGroup2(id, ele) {
            let x = this.nowIndex;
            this.moveGroupShow = false;
            let indexs = this.friendList.findIndex(x => {
                return x.pkid == id;
            });
            if(indexs != -1) {
                this.friendList[indexs].friendsList.push(ele);
                this.friendList[x[0]].friendsList.splice(x[1], 1);
                this.friendList[indexs].friendsListCont = this.friendList[indexs].length;
                if(!this.friendList[indexs].extend) {
                    this.friendList[indexs].extend = true;
                    $('.friend_group_list_every').eq(indexs).slideDown(400);
                }
            }
            this.updateGroup([ele.pkid], id);

        },

        // 移动分组方法
         async updateGroup(vals, type) {
            let obj = {
                vals: vals.join(','),
                type: type
            }
            this.$HTTP('post', '/user_friends_updateType', obj).then(res => {
                // console.log('移动分组成功', res);
            }).catch(err => {
                console.log('移动分组失败', err);
            });
        },

        // 获取好友分组列表
        getList() {
            let obj = {
                myUserId: this.userId
            }
            this.$HTTP('post', '/user_friends_getlist', obj).then( res => {
                this.friendList = [...res.result];
                for(let x of this.friendList) {
                    if(x.pkid == 0) {
                        x.extend = true;
                    }else {
                        x.extend = false; 
                    }
                }
                for(let x of this.friendList) {
                    x.friendsList.map(ele => {
                        return ele.checked = false;
                    });
                }
                this.dragStartParth(1); // 只展开第一个分组
                console.log('好友分组列表', this.friendList);
            }).catch( err => {
                console.log('获取好友分组列表失败', err);
            });
        },

        // 获取常用联系人列表
        getUserList() {
            this.usedList = [];
            return;
            let obj = {
                myUserId: this.userId
            }
            this.$HTTP('post', '/user_friends_getlist', obj).then( res => {
                this.usedList = [...res.result];
                console.log('常用联系人列表', this.usedList);
            }).catch( err => {
                console.log('获取常用联系人列表失败', err);
            });
        },

    },
    created() {
        this.getList(); // 获取好友分组列表
        this.getUserList(); // 获取常用联系人列表

    },
    mounted() {
    }
}
</script>

<style lang="less">
@import "../../assets/css/base.less";
.friend_management {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #FAFAFA;
    .friend_m_top {
        height: 50px;
        border-bottom: 1px solid @bg-f2f2f2;
        padding-left: 24px;
        .box_sizing;
        font-size: 16px;
        font-weight: bold;
        line-height: 50px;
    }

    .friend_m_center {
        width: 100%;
        height: calc(~ '100% - 50px');
        // overflow: hidden;
        position: relative;

        .friend_empty {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            img {
                .dis-in-bl;
                width: 360px;
                height: 316px;
            }

            p {
                margin-top: 60px;
                text-align: center;
            }
        }

        .friend_content {
            position: absolute;
            top: 24px;
            left: 20%;
            ._shadow {
                 -webkit-box-shadow: inset 0px 1px 6px 0px rgba(104,104,104,0.3); 
                -moz-box-shadow: inset 0px 1px 6px 0px rgba(104,104,104,0.3); 
                -webkit-box-shadow: 0px 1px 6px 0px rgba(104,104,104,0.3); 
                -moz-box-shadow: 0px 1px 6px 0px rgba(104,104,104,0.3); 
                box-shadow:0px 1px 6px 0px rgba(104,104,104,0.3); 
                .border_radius(@br: 4px;);
                background: #fff;
            }
            ._top {
                width: 100%;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid @bg-f2f2f2;
                padding-left: 24px;
                color: @grayNight;
                font-size: 16px;
                .box_sizing;
               
            }
            .friend_group {
                ._shadow;
                .dis-in-bl;
                width: 372px;
                height: 540px;
                overflow-y: auto;
                .friend_group_top {
                    .frined_jia {
                        margin-right: 15px;
                        height: 30px;
                        .icon-jia1 {
                            color: @mainColor;
                        }
                        
                    }
                    
                    .batch_operate {
                        position: relative;
                        button {
                            padding: 0 10px;
                            margin-right: 15px;
                        }
                        .remove_group {
                            position: absolute;
                            top: 50px;
                            left: 0px;
                            ._shadow;
                            max-height: 164px;
                            overflow: auto;
                            li {
                                max-width: 160px;
                                height: 32px;
                                line-height: 32px;
                                padding: 0 14px;
                                color: #333;
                                font-size: 14px;
                                .box_sizing;
                                .word_over;
                                .cur;
                                &:hover {
                                    background: @bg-f2f2f2;
                                }
                            }
                        }
                    }
                }

                .friend_group_content {
                    width: 100%;
                    height: 490px;
                    overflow: auto;
                    .friend_group_list {
                        width: 100%;

                        .frined_more {
                            height: 26px;
                            display: none;
                        }

                        .friend_group_list_top {
                            // width: 100%;
                            width: calc(~ '100% - 30px');
                            margin-left: 15px;
                            height: 40px;
                            line-height: 38px;
                            border-top: 1px solid transparent;
                            border-bottom: 1px solid @bg-f2f2f2;
                            .box_sizing;
                            .span_title {
                                 .dis-in-bl;
                                width: 230px;
                                .word_over;
                                font-weight: bold;
                                vertical-align: middle;

                            }
                         
                             .icon-unfold {
                                .dis-in-bl;
                                vertical-align: middle;
                                -webkit-transition: transform .25s linear;
                                -moz-transition: transform .25s linear;
                                -o-transition: transform .25s linear;
                                transition: transform .25s linear;
                                &:hover {
                                    color: @mainColor;
                                }

                            }
                            .icon-unfold_rotate {
                                transform: rotate(-180deg);
                                -webkit-transition: transform .25s linear;
                                -moz-transition: transform .25s linear;
                                -o-transition: transform .25s linear;
                                transition: transform .25s linear;
                            }
                            &:hover {
                                background: #FBFBFB;
                                width: 100%;
                                margin-left: 0;
                                padding: 0 15px;
                                border-top: 1px solid #E5E5E5;
                                border-bottom: 1px solid #E5E5E5;
                                .frined_more {
                                    display: inline;
                                }
                            }
                        }

                        .friend_group_list_every {
                            .friend_group_list_li {
                                width: calc(~ '100% - 30px');
                                margin-left: 15px;
                                height: 40px;
                                line-height: 38px;
                                border-top: 1px solid transparent;
                                border-bottom: 1px solid @bg-f2f2f2;
                                .box_sizing;
                                .el-checkbox {
                                visibility: hidden;
                                }
                                .header {
                                    margin-left: 4px;
                                }

                                .names {
                                     .dis-in-bl;
                                    width: 220px;
                                    .word_over;
                                    margin-left: 10px;
                                    vertical-align: middle;
                                    .names_real {
                                        color: @grayNight;
                                        margin-left: 6px;
                                    }
                                }

                                .visibility {
                                    visibility: visible !important;
                                }

                                &:hover {
                                    background: #FBFBFB;
                                    width: 100%;
                                    margin-left: 0;
                                    padding: 0 15px;
                                    border-top: 1px solid #E5E5E5;
                                    border-bottom: 1px solid #E5E5E5;
                                    .frined_more {
                                        display: inline;
                                    }
                                    .el-checkbox {
                                        visibility: visible;
                                    }
                                }
                            }
                        }
                    }
                }


            }
            .friend_used {
                ._shadow;
                .dis-in-bl;
                width: 200px;
                vertical-align: top;
                margin-left: 20px;
             
                .friend_used_list {
                    width: 100%;
                    max-height: 320px;
                    overflow-y: auto;
                    li {
                        height: 40px;
                        line-height: 38px;
                        border-top: 1px solid transparent;
                        border-bottom: 1px solid transparent;
                        .box_sizing;
                        // overflow: hidden;

                        .li_box {
                            width: calc(~ '100% - 48px');
                            height: 39px;
                            margin: 0 24px;
                            .box_sizing;
                            border-bottom: 1px solid @bg-f2f2f2;

                            .header, .names {
                                vertical-align: middle;
                            }

                            .names {
                                .dis-in-bl;
                                width: 86px;
                                .word_over;
                                margin-left: 10px;

                            }

                            .icon-close {
                                vertical-align: middle;
                                margin-left: 6px;
                                display: none;
                                 &:hover {
                                    color: @mainColor;
                                 }
                            }


                        }

                        
                        &:hover {
                            border-top: 1px solid #E5E5E5;
                            border-bottom: 1px solid #E5E5E5;
                            background: #FBFBFB;
                            .li_box {
                                border-bottom: 1px solid transparent;

                            }
                            .icon-close {
                                display: inline;
                            }
                        }

                    }
                }

                .used_empty {
                    p {
                        padding: 10px;
                        text-align: center;
                        line-height: 21px;
                        color: @grayNight;
                    }
                }
            }
        }
    }
    
}
</style>

