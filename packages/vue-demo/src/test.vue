<template>
  <div>
    <!-- <test-component :names="name" :mobile="mobile" @handleSubmit="handleSubmit"/> -->
    <test-component :names="name" :mobile="mobile" @handleSubmit="handleSubmit">
      <div slot="sss">
        i am a solt
      </div>
    </test-component>
  </div>
</template>
<script>
import '../../vue-component/dist/index.esm';

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
