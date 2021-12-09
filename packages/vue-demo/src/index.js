import Test from './test.vue';
import Vue from 'vue';


new Vue({
  el: '#appContainer',
  render: h => h(Test, { props: { sss: 'haha' } })
});