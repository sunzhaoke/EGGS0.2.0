<template>
   <div> this is '/personal/workbench/list.vue'</div>
</template>
<script>
export default {
  created() {
    let obj = { Cpkid: 1, pkids: 0, number: 0 };
    this.$HTTP("get", "/GetCategoryByPkid", obj)
      .then(res => {
        console.log('测试接口', res.result);
        
      })
      .catch(err => {
        console.log("测试接口失败", err);
      });
  }
};
</script>

