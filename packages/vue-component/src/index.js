import Test from './component.vue';
import { createBaasComponent } from '@baas-component-demo/baas-base-class';
const res = createBaasComponent(Test, [
  'name',
  'mobile',
  'handleSubmit'

]);
window.customElements.define('test-component', res);