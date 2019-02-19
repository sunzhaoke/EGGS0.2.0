<template>
    <div class="selected_file_yun popup">
         <div class="popup_box">
            <div class="popup_top">
                <span class="popup_title">文件选择</span>
                <i class="iconfont icon-guanbijiantou fr" @click="cancel"></i>
            </div>
            <div class="popup_content">
                <div id='fileBox' :class="descShow ? 'file_box demand_box_show': 'file_box'">
                    <div 
                        class="parths_group clearfix"
                        v-for="(group, index) in fileLists"
                        :key="group.pkid"
                        >
                        <!-- 分组的头部操作 -->
                        <div class="group_top">
                            <el-checkbox 
                                class="all_checked" 
                                v-model="group.checked" 
                                @change='fileCheckboxGroup($event, group)'>{{group.groupName}}</el-checkbox>
                            <div class="group_operate fr">
                                <span 
                                v-if='group.packUp' 
                                @click='groupExtendToggle(index, true)'
                                class='mainColor_underline_text'
                                >收起</span>
                            </div>
                        </div>

                        <!-- 折叠成一行的时候 -->
                        <div 
                            v-if='group.packUp === false'
                            class="group_file"
                            >
                            <div 
                                class="every_file"
                                v-for="(item, index1) in group.overList"
                                :key="item.FilePkid"
                                :groupid='group.pkid'
                                :id='item.FilePkid'
                                :filename='item.FileName'
                                @click='groupExtendToggle(index, item, index1)'
                                >
                                <template v-if='item.overLength'>
                                    <span class="file_pic">
                                        <span
                                        class="more" 
                                        v-for='(pic, index) in item.UrlMin'
                                        :key='index'
                                        >
                                            <img :src="pic" alt="
                                        ">
                                        <span class="none"></span>
                                        </span>
                                        <span class="more"><img class="more" src="../style/more.png" alt=""></span>
                                        <span class="none"></span>
                                    </span>
                                    <div class="file_info">
                                        <p class="file_length underline_text">展开更多<span class="mainColor">{{item.overLength}}</span>个文件</p>
                                    </div>
                                </template>
                                <template v-else>
                                    <span class="file_pic">
                                        <template v-if='item.FileType === 11 && item.Desc'>
                                        <span class="text_desc"><span>{{item.Desc}}</span></span>
                                        </template>
                                        <template v-else>
                                        <img :src="item.UrlMin" alt="">
                                        </template>
                                        <span class="none"></span>
                                    </span>
                                    <div class="file_info">
                                        <p class="title">{{item.FileName}}</p>
                                        <el-tooltip class="item" effect="dark" :content="item.nickName ? item.nickName : item.userName" placement="top" :open-delay="300">
                                            <img :src="item.UserPic" alt="" class="from_header">
                                        </el-tooltip>
                                        <span class="file_message fr">
                                        <i class='iconfont icon-pinglun'></i>
                                        {{item.Count}}
                                        </span>
                                        <span class="fixed file_checkbox" @click.stop>
                                            <el-checkbox v-model="item.checked" @change="everyFileCheckbox($event, item, index)"></el-checkbox>
                                        </span>
                                    </div>
                                </template>
                            </div>
                            <div class="null"></div>
                        </div>

                        <!-- 展开的时候 -->
                        <div 
                            v-else
                            class="group_file"
                            >
                            <div 
                                class="every_file"
                                v-for="(item, index1) in group.fileList"
                                :key="item.FilePkid"
                                :groupid='group.pkid'
                                :id='item.FilePkid'
                                :filename='item.FileName'
                                @click='enterTheDetails(index1, index)'
                                >
                                <span class="file_pic">
                                    <template v-if='item.FileType === 11 && item.Desc'>
                                    <span class="text_desc"><span>{{item.Desc}}</span></span>
                                    </template>
                                    <template v-else>
                                    <img :src="item.UrlMin" alt="">
                                    </template>
                                    <span class="none"></span>
                                </span>
                                <div class="file_info">
                                    <p class="title">{{item.FileName}}</p>
                                    <el-tooltip class="item" effect="dark" :content="item.nickName ? item.nickName : item.userName" placement="top" :open-delay="300">
                                        <img :src="item.UserPic" alt="" class="from_header">
                                    </el-tooltip>
                                    <span class="file_message fr">
                                    <i class='iconfont icon-pinglun'></i>
                                    {{item.Count}}
                                    </span>
                                    <span class="fixed file_checkbox" @click.stop>
                                    <el-checkbox v-model="item.checked" @change="everyFileCheckbox($event, item, index)"></el-checkbox>
                                    </span>
                                </div>
                            </div>
                            <div class="null"></div>
                        </div>

                        <div v-if='index < group.fileList.length - 1' class="group_line"></div>
                    </div>

                </div>
                <div id='demandBox' class="demand_box" v-if='descShow'>
                    <span>需求描述</span>
                    <i class="iconfont icon-guanbijiantou fr" @click="cancelDesc"></i>
                    <textarea 
                        ref='descRef'
                        :class="descTextFocus ? 'textarea_desc_focus' : 'textarea_desc'" 
                        rows="2"
                        placeholder="添加文字说明"
                        v-model='descText'
                        @focus="descFocus"
                        @blur="descBlur"
                        ></textarea>
                </div>
            </div>
            <div class="popup_bottom">
                <div class="checkbox_file fl">
                     <el-checkbox 
                        v-if='checkedFileList.length' 
                        class="all_checked" 
                        v-model="fileCheckbox" 
                        @change='fileCheckboxAll'
                        >
                        已选<span class="mainColor">{{checkedFileList.length}}</span>项
                      </el-checkbox>
                     <el-checkbox 
                        class="all_checked" 
                        v-model="fileCheckbox" 
                        @change='fileCheckboxAll'>全选</el-checkbox>
                </div>
                <button class="main_button_bg sure fr" @click="sure">确定</button>
                <button class="main_button fr" @click.stop="addDesc">需求描述</button>
            </div>
           
        </div>
        <!-- 文件详情预览 -->
        <transition name="fade1">
            <file-details 
                v-if="filedetailsShow"
                :info='enterDetailInfo'
                @closeDetails='closeDetails' />
        </transition>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import FileDetails from '../../fileDetails';

export default {
    props: ['info', 'ids'],
    components: {
        FileDetails
    },
    data() {
        return {
            userId: JSON.parse(localStorage.getItem("staffInfo")).userPkid, // 当前登录者的ID
            infos: {}, // 所有信息
            fileCheckbox: false,
            fileLists: [],
            checkedFileList: [],
            descShow: false, // 是否显示描述
            descText: '', // 需求描述的内容
            descTextFocus: false, // 需求描述获取焦点
            filedetailsShow: false, // 文件详情
            enterDetailInfo: {}, // 文件进入详情需要的数据
        }
    },
    computed: {
        ...mapState([
            'stageInfos',
            'taskIds'
        ]),
    },
    methods: { 
        // 进入文件详情
        enterTheDetails(index, groupIndex) {
            let x = this.stageInfo.stageList.findIndex(ele => ele.stageId == this.taskIds.stageId);
            this.enterDetailInfo = {
                groupIndex: groupIndex,
                fileIndex: index,
                fileList: this.stageInfo.fileList,
                type: 1,
                menuList: [
                    this.stageInfo.title, 
                    this.stageInfo.stageList[x].stageTitle, 
                    this.stageInfo.fileList[groupIndex].groupName, 
                    this.stageInfo.fileList[groupIndex].fileList[index].FileName
                ]
            }
            this.filedetailsShow = true;
        
        },
        // 关闭文件详情
        closeDetails() {
            this.filedetailsShow = false;
        },
        // 文件组折叠/展开
        groupExtendToggle(index, item, index1) {
            if(item !== true && !item.overLength) {
                this.enterTheDetails(index, index1);
                return;
            }
            this.fileLists[index].packUp = !this.fileLists[index].packUp;
        },

        // 计算需要折叠的文件个数--分组折叠成一行
        countFileMore(i) {
            const x = 4;
            let list = [...this.fileLists[i].fileList];
            let length = list.length;
            if (length <= x) {
                this.fileLists[i].packUp = null;
                this.fileLists = this.fileLists.concat();
                return;
            }
            this.fileLists[i].packUp = false;
            let over = length - x;
            let overList = [...list].splice(0, x - 1);

            let others = [...list].splice(x - 1);
            let urls = [];
            others.map(ele => urls.push(ele.UrlMin));

            if (urls.length > 3) {
            urls.splice(0, 3);
            }
            overList.push({
            FilePkid: `group${i}`,
            FileName: null,
            UrlMin: urls,
            FileType: null,
            userName: null,
            overLength: over + 1
            });
            this.fileLists[i] = Object.assign({}, this.fileLists[i], {
            overList: overList
            });
            this.fileLists = this.fileLists.concat();
            // console.log('countFileMore--', 'w--> ' + w, 'x--> ' + x, 'length==>' + this.fileLists[i].fileList.length, this.fileLists[i]);
        },

        // 文件全选
        fileCheckboxAll(val) {
            for(let x of this.fileLists) {
                x.checked = val;
                for(let y of x.fileList) {
                    y.checked = val;
                }
            }
            this.handleCheckBox(val);
            this.fileLists = this.fileLists.concat();
        },
        // 文件组的选中状态发生改变
        fileCheckboxGroup(val, item) {
            item.checked = val;
            for(let y of item.fileList) {
                y.checked = val;
            }
            this.handleCheckBox(val, item);
            this.fileLists = this.fileLists.concat();

        },
        // 文件的选中状态发生改变
        everyFileCheckbox(val, item, index) {
            item.checked = val;
            this.handleCheckBox(val, item, index);
            this.fileLists = this.fileLists.concat();
        },
        handleCheckBox(val, item, index) {
            const length = arguments.length;
            let x1, x2;
            if(length === 3) { // 单个文件选择
                if(val) {
                    x1 = this.fileLists[index].fileList.findIndex(ele => !ele.checked);
                    if(x1 !== -1) {
                        this.fileLists[index].checked = false;
                    }else {
                        this.fileLists[index].checked = true;
                    }
                }else {
                   this.fileLists[index].checked = false;
                }
                x1 = this.fileLists.findIndex(ele => !ele.checked);
                if(x1 !== -1) {
                    this.fileCheckbox = false;
                }else {
                    this.fileCheckbox = true;
                }

            }else if(length === 2) { // 文件组选择
                x1 = this.fileLists.findIndex(ele => !ele.checked);
                if(x1 !== -1) {
                    this.fileCheckbox = false;
                }else {
                    this.fileCheckbox = true;
                }
            }
            this.fileLists = this.fileLists.concat();
        },
        numSelected() {
            return new Promise((resolve) => {
                let arr1 = [] , arr2 = [];
                for(let x of this.fileLists) {
                    if(x.checked) {
                        arr1.push(x.pkid);
                    }else {
                        for(let y of x.fileList) {
                            if(y.checked) {
                                arr2.push(y.FilePkid);
                            }
                        }
                    }
                    
                }
                resolve([arr1, arr2]);
                return [arr1, arr2];
            });

        },
        sendHttp(arr) {
            return new Promise((resolve) => {
                if(!arr[0].length && !arr[1].length && !this.descText) {
                    this.$message.warning('请选择交接文件或添加需求描述');
                    return;
                }
                let obj = {
                    projectId: this.taskIds.projectId,
                    oldstageId: this.taskIds.stageId,
                    stageId: this.ids.join(','),
                    taskId: this.taskIds.taskId,
                    descn: this.descText,
                    groupIdVals: arr[0].join(','),
                    fileIdVals: arr[1].join(','),
                    myUserId: this.taskIds.userId,
                }
                this.$HTTP('post', '/demand_add', obj).then(res => {
                    this.$emit('handleSure');

                }).catch(err => {
                    console.log(err);
                });
            });
        },

        addDesc() {
            this.descShow = true;
            this.$nextTick(() => {
                this.$refs.descRef.focus();
            });
        },
        cancelDesc() {
            this.descShow = false;
            this.descText = '';
        },
        descFocus() {
            this.descTextFocus = true;
        },
        descBlur() {
            this.descTextFocus = false;
        },
        cancel() {
            this.$emit('handleCancle');
        },
        async sure() {
            const arr = await this.numSelected();
            await this.sendHttp(arr);
        },
        // 数据的获取/设置
        setData() {
            this.stageInfo = JSON.parse(JSON.stringify(this.stageInfos));
            this.fileLists = this.stageInfo.fileList;
            let id = this.userId;
            for(var i = 0; i < this.fileLists.length; i++) {
                let x = this.fileLists[i];
                if(x.fileList.length) {
                    this.$set(this.fileLists[i], 'packUp', null);
                    this.$set(this.fileLists[i], 'checked', false);
                    x.fileList.map(ele => ele.checked = false);
                    for(let y = 0; y < x.fileList.length; y++) {
                        if(x.fileList[y].UserPkid != id) {
                            x.fileList.splice(y, 1);
                            y--;
                        }
                    }
                    if(x.fileList.length) {
                        this.countFileMore(i);
                    }else {
                        this.fileLists.splice(i, 1);
                    }

                }else {
                    this.fileLists.splice(i, 1);
                }
                
            }
            this.stageInfo.fileList = [...this.fileLists];
            console.log('选择交接文件---', this.stageInfos, this.ids);
        },
    },
    created() {
        this.setData();
        console.log('文件选择----');
    }
}
</script>
<style lang="less">
@import "../../../../assets/css/base.less";

    .selected_file_yun {
        background-color: rgba(0,0,0,0.01) !important;
        .popup_box {
            width: 800px;
            height: 540px;
            overflow: hidden;
            .popup_content {
                width: 100%;
                height: 434px;
                overflow: hidden;
                .file_box {
                    width: 100%;
                    height: 434px;
                    padding: 10px 24px;
                    .box_sizing;
                    overflow: auto;
                    .parths_group {
                        .group_top {
                        //    margin-top: 16px;
                        }
                        .group_file {
                                margin-left: -36px;
                            .every_file {
                                margin-left: 36px;
                                margin-top: 16px;
                                .file_checkbox .el-checkbox{
                                    margin-top: 3px;
                                }
                            }
                        }
                        .group_line {
                            width: 100%;
                            height: 1px;
                            background: #E6E6E6;
                            margin-top: 16px;
                            margin-bottom: 16px;
                        }
                    }
                }
                .demand_box_show {
                    height: 334px;
                    width: 100%;
                }
                .demand_box {
                    width: 100%;
                    height: 100px;
                    padding: 10px 24px;
                    border-top: 1px solid @line;
                    background: #FAFAFA;
                    .box_sizing;
                    span {
                        font-weight: bold;
                    }
                    .textarea_desc {
                        width: 100%;
                        height: 50px;
                        margin-top: 10px;
                        line-height: 24px;
                        outline:none;
                        resize: none;
                        border: 1px solid @line;
                        background: #FFFFFF;
                        .border_radius(@br: 4px;);
                        padding: 0 4px;
                        .box_sizing;
                    }
                    .textarea_desc_focus {
                        width: 100%;
                        height: 50px;
                        margin-top: 10px;
                        line-height: 24px;
                        outline:none;
                        resize: none;
                        border: 1px solid @mainColor;
                        background: #FFFFFF;
                        .border_radius(@br: 4px;);
                        padding: 0 4px;
                        .box_sizing;
                    }

                }
            }
            .popup_bottom {
                width: 100%;
                height: 50px;
                line-height: 50px;
                padding: 0 24px;
                border-top: 1px solid #f6f6f6;
                .box_sizing;
                .main_button {
                    color: @mainColor;
                    margin-right: 10px;
                }
                button {
                    margin-top: 10px;
                }
                
            }
        }
        
    }
</style>


