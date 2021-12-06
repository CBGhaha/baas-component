
import { createVueBaasComponent } from 'baas-base-vue'; // Vue BaaS组件工厂函数
import Test from './demo.vue';

const webCompnentInstance = createVueBaasComponent(Test);
window.customElements.define('test-component', webCompnentInstance);
