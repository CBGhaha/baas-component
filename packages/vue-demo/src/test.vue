<template>
  <div>
    <!-- <test-component :names="name" :mobile="mobile" @handleSubmit="handleSubmit"/> -->
    <test-component2 :names="name" :mobile="mobile" @handleSubmit="handleSubmit">
      <div slot="sss">
        i am a solt
      </div>
    </test-component2>
  </div>
</template>
<script>
import '@baas-component-demo/vue-component';

export default {
  name: "Demo",
  data(){
    return{
      name: '1111',
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
