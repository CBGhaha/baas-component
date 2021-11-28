<template>
  <div class="demo">
   <div class="name">
     <label>姓名：</label>
     <input v-model="nameVal" type="text"/>
   </div>
   <div class="mobile">
     <label>电话</label>
     <input  v-model="mobileVal" type="number"/>
   </div>
   <div @click="submit">提交</div>
  </div>
</template>

<script>
export default {
  props:['name', 'mobile', 'handleSubmit'],
  name: "Page404",
  data(){
    return {
      nameVal: this.name,
      mobileVal: this.mobile,
    }
  },
  computed: {
  },
  mounted(){
    console.log("mounted:", this.name, this.mobile)
  },
  methods:{
    submit(){
      console.log('this.handleSubmit', typeof this.handleSubmit);
      // this.handleSubmit();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>

</style>
