<template>
  <div>
    <test-component :name="name" :mobile="mobile" :handleSubmit="handleSubmit"/>
  </div>
</template>
<script>
import '@baas-component-demo/vue-runtime';
import '@baas-component-demo/vue-component';

export default {
  name: "Demo",
  data(){
    return{
      name: {a:111},
      mobile: '168000000000'
    }
  },
  methods:{
    handleSubmit(data){
      console.log("用户提交：", data)

    }
  }
};
</script>

<style scoped>

</style>
