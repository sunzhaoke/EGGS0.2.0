<template>
    <div id="myinbox">
       <List v-if="toggleInfo"  ></List>
       <Info v-if="toggleInfo"></Info>
       <SetUp v-if="toggleInfo"></SetUp>
    </div>
</template>
<script>
import List from "./list";
import Info from "./info";
import SetUp from "./setup";
export default {
  components: {
    List,
    Info,
    SetUp
  },
  data() {
    return {
      toggleInfo: false
    };
  }
};
</script>
<style lang='less'>
#myinbox {
  width: 100%;
  height: 100%;
}
</style>

