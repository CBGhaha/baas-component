
import Vue from 'vue';

const createBaasComponent = (com, config)=>{
  class BaasVueBase extends HTMLElement {
    static props;
    static component;
    vm;
    constructor() {
      super();
    }
    mount() {
      const content = document.createElement('div');
      const attributes = {};
      BaasVueBase.props.forEach(prop => {
        attributes[prop] = this.getAttribute(prop);
      });
      console.log('attributes is:', attributes);
      this.appendChild(content);
      this.vm = new Vue({
        el: content,
        data: attributes,
        render(h) {
          return h(BaasVueBase.component, { props: attributes });
        }
      });
    }
    connectedCallback() {
      this.mount();
    }
    static get observedAttributes() {
      return BaasVueBase.props;
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (this.vm) {
        this.vm[attrName] = newVal;
      }
    }
  }
  BaasVueBase.component = com;
  BaasVueBase.props = config;
  return BaasVueBase;
};
export default createBaasComponent;