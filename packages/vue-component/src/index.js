
import { createVueBaasComponent } from '../../baas-base-class';
import reactWarpperForVue from '@baas-component-demo/react-warpper';
import Test from './component.vue';

const webCompnentInstance = createVueBaasComponent(Test);
window.customElements.define('test-component', webCompnentInstance);

const ComponentDemoForReact = reactWarpperForVue(Test);
export {
  ComponentDemoForReact
};
