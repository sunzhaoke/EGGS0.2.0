<template>
    <div class="reminder2 transfer_view_yun">
        <div class="reminder2_box">
            <div class="reminder2_top">温馨提示</div>
            <div class="reminder2_center">
                <p class="text">请确认是否将该文件移交给下一阶段使用</p>
                <el-select  
                    v-model="values"
                    size="small"
                    :multiple="true"
                    collapse-tags
                    @change="selectChange"
                    placeholder="请选择阶段">
                    <el-option v-for="item in selectLists"
                        :key="item.value"
                        :label="item.label == null ? '未分组' : item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                    </el-option>
                </el-select>
               
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
                 <p  
                    v-else 
                    class="transfer_desc mainColor"
                    @click='addDesc'
                    >需求描述</p>
            </div>
            
            <div class="reminder2_bottom">
                <button class="but fl"
                    @click="cancel">取消</button>
                <button v-if="!values.length && !descText"
                    disabled
                    class="but but_right color_dis fl"
                    >确认</button>
                <button v-else
                    class="but but_right color_main fl"
                    @click="sure">确认</button>
               
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
    props: ["selectList", "default"],
    data() {
        return {
            values: this.default ? this.default : [],
            selectLists: this.selectList ? this.selectList : [],
            descShow: false,
            descText: '',
            descTextFocus: false
        }
    },    

    methods: {
        cancel() {
            this.$emit('handleCancle');
        },
        sure() {
            this.$emit('handleSure', this.values, this.descText);

        },
        selectChange(val) {
            this.values = val;
            // console.log(this.values);
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
        
    },
    mounted() {
        $('#inputValue').focus();
    }
}
</script>
<style lang="less">
    @import "../../../../assets/css/base.less";
    @mainColor: #3684FF;
    .transfer_view_yun {
        .reminder2_center {
            padding: 20px 0 0 0 !important;
            .text {
                margin-top: 0 !important;
                margin-bottom: 16px !important;
            }
            .transfer_desc {
                margin: 16px 0;
                cursor: pointer;
            }
            .demand_box {
                width: 100%;
                height: 100px;
                background: #FAFAFA;
                margin-top: 16px;
                padding: 10px 24px;
                .box_sizing;
                text-align: left !important;

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
    }
</style>


