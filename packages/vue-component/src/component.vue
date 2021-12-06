<template>
  <div class="demo">
   <div class="name">
     <label>姓名：</label>
     <input v-model="nameVal" type="text"/>
   </div>
   <div class="mobile">
     <label>电话:</label>
     <input  v-model="mobileVal" type="number"/>
   </div>
   <button @click="submit">提交</button>
   <slot name="sss"></slot>
  </div>
</template>
<script>
export default {
  name: "vue-component",
  props:['names', 'mobile'],
  data(){
    return {
      nameVal: this.names,
      mobileVal: this.mobile,
    }
  },
  computed: {
  },
  watch:{
    names(val){
      this.nameVal = val;
    },
    mobile(val){
      this.mobileVal = val;
    }
  },
  methods:{
    submit(){
      this.$emit('handleSubmit', {nameVal: this.nameVal, mobileVal: this.mobileVal})
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.demo{
  width: 300px;
  >div{
    display: flex;
    align-items: center;
    height: 50px;
    label{
      display: block;
      width: 80px;
      font-size: 14px;
      font-weight: normal;
    }
    input{
      display: block;
      height: 28px;
      border: 1px solid #999;
      color: #333;
      font-size: 14px;
      border-radius: 4px;
      text-indent: 8px;
      width: 240px;
    }
  }
  button{
    background: cornflowerblue;
    border: none;
    border-radius: 5px;
    display: block;
    margin: 0 auto;
    margin-top: 20px;
    width: 80px;
    height: 32px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
