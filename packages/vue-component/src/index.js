
import { createVueBaasComponent } from '../../baas-base-class/dist/index.esm';
import Test from './component.vue';

const webCompnentInstance = createVueBaasComponent(Test);
// const webCompnentInstance2 = createVueBaasComponent2(Test);
window.customElements.define('test-component', webCompnentInstance);
// window.customElements.define('test-component2', webCompnentInstance2);
// console.log('Test is:', Test);