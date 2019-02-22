<template>
    <div class="notice_wrapper" @click.stop>
        <div class="notice_content">
            <div class="notice_top">
                <span class='fl'>通知</span>
                <span v-if='noticeList.length' class="fr" @click.stop='clickAllRead'>标记全部已读</span>
                <span v-else class="fr cur_dis">标记全部已读</span>
            </div>
            <div class="notice_list" id='noticeList'>
                <template v-if='noticeList.length'>
                    <div 
                        class="notice_every clearfix"
                        v-for='(item, index) in noticeList'
                        :key='item.Pkid'
                        @click="enterDetail(item, index)"
                        >
                        <span class="left_header fl">
                            <img :src="item.userPic" alt="">
                        </span>
                        <div class="right_detail fl">
                            <div class="notice_from">{{item.userName}}</div>
                            <div class="notice_type" v-if='item.Type === 1'>已将你加入<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span></div>
                            <div class="notice_type" v-else-if='item.Type === 2'>已将你移出<span class="gray_night">{{item.Content}}</span></div>
                            <div class="notice_type" v-else-if='item.Type === 3'>已将你加入<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>阶段</div>
                            <div class="notice_type" v-else-if='item.Type === 4'>已将你移出<span class="gray_night">{{item.Content}}</span>阶段</div>
                            <div class="notice_type" v-else-if='item.Type === 11'>评论<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>：{{item.Remarks}}</div>
                            <div class="notice_type" v-else-if='item.Type === 5'>评论<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>：{{item.Remarks}}</div>
                            <div class="notice_type" v-else-if='item.Type === 6'>在评论 <span>{{item.userName}}</span>的<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>时@你：{{item.Remarks}}</div>
                            <div class="notice_type" v-else-if='item.Type === 7'>已经完成工作并将文件移交给你</div>
                            <div class="notice_type" v-else-if='item.Type === 8'>已将<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>交接给你</div>
                            <div class="notice_type" v-else-if='item.Type === 9'>已将<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>归档</div>
                            <div class="notice_type" v-else-if='item.Type === 10'>已将<span :class="item.Enabled ? 'mainColor_text' : 'read_style'">{{item.Content}}</span>从归档项目中恢复</div>
                            <div class="notice_time">{{item.showDate}}</div>
                        </div>
                        <i 
                        class='iconfont icon-yidu'
                        @click.stop='clickRead(index)'
                        ></i>
                        <div class="bottom_line" v-if='index < noticeList.length - 1'></div>
                    </div>
                </template>
                <div v-else class="notice_empty">
                    <div class="empty_img"><img src="../../assets/img/notice_empty.png" alt=""></div>
                    <p>您还没有未读通知点击</p>
                    <p>点击<span class="mainColor_text" @click='seeAllNotice'>查看全部通知</span>查看所有通知</p>
                </div>
            </div>
            <div class="notice_bottom">
                <span class='fl' @click='seeAllNotice'>查看全部通知</span>
                <el-tooltip effect="dark" content="设置" placement="top" :open-delay="300">
                <i 
                    class='iconfont icon-shezhi1 fr'
                    @click='clickSet'
                    ></i>
                </el-tooltip>
            </div>  
        </div>
        <div class="arrow_div">
            <div class="arrow_box"></div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {
            userId: JSON.parse(localStorage.getItem("staffInfo")).userPkid, // 当前登录者的ID
            noticeList: [],
            catchList: [],
            loadMore: false, // 是否可以加载更多
        }
    },
    computed: {
        ...mapState(['unreadNum']),
    },
    methods: {
        ...mapMutations(['UNREAD_CHANGE']),

        // 点击查看所有通知
        seeAllNotice() {
            this.$router.push("/notice");
            this.$emit('enterAll');

        },

        // 标记全部已读
        clickAllRead() {
            let obj = { userId: this.userId };
            this.$HTTP("post", "/user_update_notificationStateAll", obj)
            .then(res => {
                this.UNREAD_CHANGE(0);
                this.noticeList = [];
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
                this.$nextTick(() => {
                    $('.notice_every').eq(index).hide(() => {
                        this.noticeList.splice(index, 1);
                        console.log(this.noticeList);
                        if(this.catchList.length) {
                            this.noticeList.push(this.catchList[0]);
                            this.catchList.shift();
                            this.noticeList = this.noticeList.concat();

                        }else {
                            if(this.unreadNum > 4) {
                                this.getNoticeList(1, 10, true);
                            }
                            this.noticeList = this.noticeList.concat();

                        }
                    });
                });
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

        // 点击设置
        clickSet() {

        },
        getNoticeList(page = 1, number = 10, add = false) {
            let obj = { page: page, number: number, userId: this.userId, enabled: 1 };
            this.$HTTP("post", "/user_get_notificationList", obj, !add ? $('#noticeList')[0] : null)
            .then(res => {
                let result = [...res.result];
                result.map(ele => ele.showDate = this.timeDiff(ele.CreateTime));
                // console.log("消息列表", res.result);
                if(result.length <= 4) {
                    this.noticeList = result;
                    this.catchList = [];
                }else {
                    this.noticeList = result.splice(0,4);
                    this.catchList = [...result];
                }
                console.log(this.noticeList, this.catchList);
              
            })
            .catch(err => {
            console.log("消息列表获取失败", err);
            });
        },
    },
    created() {
        this.getNoticeList();
    },
}
</script>
<style lang='less'>
    @import "../../assets/css/base.less";
    .notice_wrapper {
        width: 380px;
        height: 453px;
        background: #FFFFFF;
        box-shadow:0px 1px 4px 0px rgba(59,81,133,0.3);
        border-radius: 4px;
        position: absolute;
        top: 39px;
        left: -158px;
        .notice_content {
            width: 100%;
            height: 100%;
            .notice_top {
                height: 55px;
                line-height: 55px;
                padding: 0 24px;
                .box_sizing;

                .fl {
                    font-weight: bold;
                    font-size: 16px;
                }  
                .fr {
                    color: @grayNight;
                    &:hover {
                        color: @mainColor;
                    }
                } 
            }
            .notice_list {
                width: 100%;
                height: 344px;
                border-top: 1px solid @bg-f2f2f2;
                border-bottom: 1px solid @bg-f2f2f2;
                overflow-x: hidden;
                overflow-y: auto;
                .notice_every {
                    width: 100%;
                    padding: 18px 0 16px 24px;
                    .box_sizing;
                    position: relative;
                    .icon-yidu {
                        display: none;
                        position: absolute;
                        top: 18px;
                        right: 24px;
                        font-size: 12px;
                        color: @grayNight;
                        &:hover {
                            color: @mainColor;
                        }
                    }
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
                        .notice_from {
                            font-weight: bold;
                            text-align: left;
                            line-height: 1;
                        }
                        .notice_type {
                            text-align: left;
                            line-height: 1;
                            margin-top: 8px;
                            margin-bottom: 4px;
                            width: 290px;
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
                        .notice_time {
                            color: @grayNight;
                            font-size: 12px;
                            text-align: left;
                            line-height: 1;

                        }
                    }
                    .bottom_line {
                        width: 330px;
                        position: absolute;
                        bottom: 0;
                        left: 24px;
                        border-bottom: 1px solid @bg-f2f2f2;

                    }
                    &:hover {
                        background: @bg-f2f2f2;
                        .icon-yidu {
                            display: inline-block;
                        }
                    }
                }
                .notice_empty {
                    .empty_img {
                        margin-top: 50px;
                        margin-bottom: 24px;
                    }
                    p {
                        line-height: 30px;
                        font-size: 12px;
                    }
                }
            }
            .notice_bottom {
                height: 54px;
                line-height: 54px;
                padding: 0 24px;
                .box_sizing;
                .fr {
                    font-size: 16px;
                    color: @graySix;
                    &:hover {
                        color: @mainColor;
                    }
                }  
                .fl {
                    color: @grayNight;
                    &:hover {
                        color: @mainColor;
                    }
                } 
            }
        }
        .arrow_div {
            position: absolute;
            top: -10px;
            left: 182px;
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

