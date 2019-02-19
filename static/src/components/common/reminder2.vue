<template>
    <div class="reminder2">
        <div v-if="types == 1"
             class="reminder2_box">
            <div class="reminder2_top">温馨提示</div>
            <div class="reminder2_center">
                <p class="text">{{texts}}</p>
                <el-select v-if="selectLists.length"
                           v-model="values"
                           size="small"
                           :multiple="multiples"
                           collapse-tags
                           @change="selectChange"
                           :placeholder="selectPlaceholders">
                    <el-option v-for="item in selectLists"
                               :key="item.value"
                               :label="item.label == null ? '未分组' : item.label"
                               :value="item.value"
                               :disabled="item.disabled">
                    </el-option>
                </el-select>
            </div>
            
            <div class="reminder2_bottom">
                <button class="but fl"
                        @click="cancel">取消</button>
                <template v-if='multiples'>
                    <button v-if="selectLists.length && !values.length"
                        disabled
                        class="but but_right color_dis fl"
                        @click="sure">{{sureTexts ? sureTexts : '确认删除'}}</button>
                    <button v-else
                            class="but but_right color_main fl"
                            @click="sure">{{sureTexts ? sureTexts : '确认删除'}}</button>
                </template>
                <template v-else>
                    <button v-if="selectLists.length && values === ''"
                        disabled
                        class="but but_right color_dis fl"
                        @click="sure">{{sureTexts ? sureTexts : '确认删除'}}</button>
                    <button v-else
                            class="but but_right color_red fl"
                            @click="sure">{{sureTexts ? sureTexts : '确认删除'}}</button>
                </template>
            </div>
        </div>
        <div v-else
             class="reminder2_box">
            <div class="reminder2_top">{{types}}</div>
            <div class="reminder2_center">
                <input id="inputValue"
                       class="input"
                       type="text"
                       :placeholder="texts"
                       v-model="values"
                       autofocus
                       @keyup.enter="sure">
            </div>
            <div class="reminder2_bottom">
                <button class="but fl"
                        @click="cancel">取消</button>
                <button class="but but_right color_main fl"
                        :disabled="values == ''"
                        :class="values == '' ? 'color_dis' : ''"
                        @click="sure">确定</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["type", "text", "inputValue", "selectList", "sureText", "multiple", "selectPlaceholder"],
    data() {
        return {
            types: this.type ? this.type : '1',
            texts: this.text ? this.text : '是否确定删除',
            values: this.inputValue ? this.inputValue : (this.multiple ? [] : ''),
            selectLists: this.selectList ? this.selectList : [],
            sureTexts: this.sureText ? this.sureText : '',
            multiples: this.multiple ? this.multiple : false,
            selectPlaceholders: this.selectPlaceholder ? this.selectPlaceholder : '请选择分组',
        }
    },
    methods: {
        cancel() {
            this.$emit('handleCancle');
        },
        sure() {
            this.$emit('handleSure', this.values);

        },
        selectChange(val) {
            this.values = val;
            console.log(this.values);
        }
    },
    mounted() {
        $('#inputValue').focus();
    }
}
</script>
<style lang="less">
</style>


