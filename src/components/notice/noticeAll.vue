<template>
    <div class="all_notice">
        <div class="all_notice_top">
            <span class="fl top_fl">全部通知</span>
            <i class="iconfont icon-guanbijiantou fr" @click="returnBack"></i>
            <span v-if='isAllRead' class="fr top_fr" @click='clickAllRead'>标记全部已读</span>
            <span v-else class="fr top_fr cur_dis">标记全部已读</span>
        </div>
        <div class="all_notice_list">
            <div 
                class="all_notice_every clearfix"
                :class="item.Enabled ? false : 'is_read'"
                v-for='(item, index) in noticeList'
                :key='item.Pkid'
                @click="enterDetail(item, index)"
                >
                <span class="left_header fl">
                    <img :src="item.userPic" alt="">
                </span>
                <div class="right_detail fl">
                    <div class="right_detail_top">
                        <span class="notice_from">{{item.userName}}</span>
                        <span class='location' v-if='item.Type !== 1 && item.Type !== 2 && item.Type !== 9'>{{item.ProjectTitle}}</span>
                    </div>
                    <div class="notice_type" v-if='item.Type === 1'>已将你加入<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span></div>
                    <div class="notice_type" v-else-if='item.Type === 2'>已将你移出<span class="gray_night">{{item.Content}}</span></div>
                    <div class="notice_type" v-else-if='item.Type === 3'>已将你加入<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>阶段</div>
                    <div class="notice_type" v-else-if='item.Type === 4'>已将你移出<span class="gray_night">{{item.Content}}</span>阶段</div>
                    <div class="notice_type" v-else-if='item.Type === 5'>评论<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>：{{item.Remarks}}</div>
                    <div class="notice_type" v-else-if='item.Type === 11'>评论<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>：{{item.Remarks}}</div>
                    <div class="notice_type" v-else-if='item.Type === 6'>在评论 <span>{{item.userName}}</span>的<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>时@你：{{item.Remarks}}</div>
                    <div class="notice_type" v-else-if='item.Type === 7'>已经完成工作并将文件移交给你</div>
                    <div class="notice_type" v-else-if='item.Type === 8'>已将<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>交接给你</div>
                    <div class="notice_type" v-else-if='item.Type === 9'>已将<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>归档</div>
                    <div class="notice_type" v-else-if='item.Type === 10'>已将<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>从归档项目中恢复</div>
                </div>
                <div class="hover_show">
                    <span class="notice_time">{{item.showDate}}</span>
                    <i 
                        v-if='item.Enabled'
                        class='iconfont icon-yidu'
                        @click.stop='clickRead(index)'
                    ></i>
                </div>
                <div class="bottom_line"></div>
            </div>
            <div 
                v-if="loadMoreShow" 
                class="load_more"
                @click="loadMore"
                >查看更多通知</div>
            <div 
                v-else
                class="load_more"
                ></div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
    data() {
        return {
            fromPath: '',
            userId: JSON.parse(localStorage.getItem("staffInfo")).userPkid, // 当前登录者的ID
            noticeList: [], // 消息列表
            loadMoreShow: false, // 是否显示查看更多通知
            page: 1,
            number: 10,
           

        }
    },
    computed: {
        ...mapState(['unreadNum']),
        isAllRead() {
            let have = this.noticeList.findIndex(ele => ele.Enabled);
            if(have !== -1) {
                return true;
            }else {
                return false;
            }
        }
    },
   
    methods: {
        ...mapMutations(['UNREAD_CHANGE']),
        returnBack() {
            if(this.fromPath) {
                this.$router.push(this.fromPath);
            }else {
                this.$router.push('/project');
            }
        },
        // 标记全部已读
        clickAllRead() {
            let obj = { userId: this.userId };
            this.$HTTP("post", "/user_update_notificationStateAll", obj)
            .then(res => {
                this.UNREAD_CHANGE(0);
                this.noticeList.map(ele => ele.Enabled = false);
            })
            .catch(err => {
                console.log("标记已读失败", err);
            });
        },
        // 点击标记已读
        clickRead(index) {
            let obj = { pkid: this.noticeList[index].Pkid };
            this.$HTTP("post", "/user_update_notificationState", obj)
            .then(res => {
                let num = this.unreadNum - 1;
                this.UNREAD_CHANGE(num);
                this.noticeList[index].Enabled = false;
                this.noticeList = this.noticeList.concat();
            })
            .catch(err => {
                console.log("标记已读失败", err);
            });
            
        },
        // 进入通知详情
        enterDetail(item, index) { 
            this.clickRead(index);
            
             /**
             * 1 已将你加入  项目  
             * 2 已将你移除
             * 3 已将你加入  ...   阶段   
             * 4 已将你移除  ...   阶段   
             * 5 评论  
             * 6 评论@ 
             * 7已经完成的工作并将文件转交给你
             * 8 已将 ... 交接给你  
             * 9 已将  。。。归档
             * 10 已将  。。。从归档项目中恢复
             * 11 相关需求中的评论  
             * **/
            let type = item.Type;
            if(type === 1) {
                this.$router.push({name: 'ProjectInfo', params: {projectId: item.ProjectId}});
            }else if(type === 2) {
                return;
            }else if(type === 3 || type === 4) {
                this.$router.push({
                    name: 'TaskDetail',
                    params: {
                        projectId: item.ProjectId,
                        stageId: item.StageId,
                        taskId: item.TaskId,
                        type: type
                    }
                });

            }else if(type === 5 || type === 6 || type === 11) {
                // console.log(item);
                this.$router.push({
                    name: 'TaskDetail',
                    params: {
                        projectId: item.ProjectId,
                        stageId: item.StageId,
                        taskId: item.TaskId,
                        type: type,
                        noticeFile: item.Id
                    }
                });
            }else if(type === 7) {
                this.$router.push({
                    name: 'TaskDetail',
                    params: {
                        projectId: item.ProjectId,
                        stageId: item.StageId,
                        taskId: item.TaskId,
                        type: type
                    }
                });
            }else if(type === 8) {
                this.$router.push({
                    name: 'ProjectInfo', 
                    params: {
                        projectId: item.ProjectId,
                        type: 8,
                    }
                });

            }else if(type === 9 || type === 10) {
                this.$router.push({
                    name: 'ProjectInfo', 
                    params: {
                        projectId: item.ProjectId,
                        type: 9,
                    }
                });

            }
            // this.$router.push('/noTask');
        },

        // 查看更多通知
        loadMore() {
            this.page++;
            this.getNoticeList(this.page, 20, true);
        },
        getNoticeList(page = 1, number = 20, load = false) {
            let obj = { page: page, number: number, userId: this.userId, enabled: '' };
            this.$HTTP("post", "/user_get_notificationList", obj, $('#app')[0])
            .then(res => {
                let result = [...res.result];
                // console.log("消息列表", result);
                result.map(ele => ele.showDate = this.timeDiff(ele.CreateTime));
                if(load) {
                    this.noticeList = this.noticeList.concat(result);
                }else {
                    this.noticeList = result;
                }
                if(this.noticeList.length && this.noticeList.length < Number(res.iRecordsTotal)) {
                    this.loadMoreShow = true;
                }else {
                    this.loadMoreShow = false;
                }
            })
            .catch(err => {
            console.log("消息列表获取失败", err);
            });
        },
    },
    created() {
        this.getNoticeList();
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.fromPath = from.path;
        });

    }
}
</script>
<style lang='less'>
@import "../../assets/css/base.less";
    .all_notice {
        width: 100%;
        height: 100%;
        .all_notice_top {
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #EEEEEE;
            .top_fl {
                margin-left: 24px;
                font-size: 16px;
                font-weight: bold;
            }
            .top_fr {
                margin-right: 24px;
                color: @grayNight;
                .cur;
                &:hover {
                    color: @mainColor;
                }

            }
            .icon-guanbijiantou {
                margin-right: 24px;
                font-size: 14px;
                font-weight: bold;
                color: @graySix;
                &:hover {
                    color: @mainColor;
                }
            }
        }
        .all_notice_list {
            width: 100%;
            height: calc(100% - 51px);
            overflow-x: hidden;
            overflow-y: auto;
            .all_notice_every {
                width: 100%;
                padding: 16px 0 16px 24px;
                .box_sizing;
                .cur;
                position: relative;
                .left_header {
                    width: 28px;
                    height: 28px;
                    img {
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        .border_radius(@br: 4px;);
                    }
                }
                .right_detail {
                    margin-left: 10px;
                    width: calc(100% - 24px - 28px - 10px);
                    .right_detail_top {
                        width: 100%;
                        overflow: hidden;
                        .notice_from {
                            font-weight: bold;
                            text-align: left;
                            line-height: 1;
                        }
                        .location {
                            margin-left: 10px;
                            font-size: 12px;
                            color: @grayNight;
                            display: inline-block;
                            line-height: 1;
                            width: calc(100% - 120px - 120px);
                            .word_over;
                        }
                    }
                    .notice_type {
                        text-align: left;
                        line-height: 1;
                        margin-top: 10px;
                        width: 100%;
                        .word_over;
                        .gray_night {
                            color: @grayNight;
                            padding: 0 5px;
                        }
                        .read_style {
                            color: @grayNight;
                            padding: 0 5px;
                            .cur;
                            &:hover {
                                color: @mainColor;
                                text-decoration: underline;
                            }
                        }
                    }
                }
                .hover_show {
                    position: absolute;
                    top: 16px;
                    right: 24px;
                    .notice_time {
                        color: @grayNight;
                        font-size: 12px;
                    }

                    .icon-yidu {
                        display: none;
                        font-size: 12px;
                        color: @grayNight;
                        margin-left: 10px;
                        &:hover {
                            color: @mainColor;
                        }
                    }
                }
                .bottom_line {
                    width: calc(100% - 24px * 2);
                    position: absolute;
                    bottom: 0;
                    padding: 0 24px;
                    .box_sizing;
                    border-bottom: 1px solid @bg-f2f2f2;

                }
                &:hover {
                    background: @bg-f2f2f2;
                    .icon-yidu {
                        display: inline-block;
                    }
                }
            }
            .is_read {
                opacity: 0.6;
            }
        }
        .load_more {
            color: @mainColor;
            height: 50px;
            line-height: 50px;
            .cur;
            margin-left: 24px;
            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>

