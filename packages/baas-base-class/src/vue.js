
import Vue from 'vue';


// 重写Vue的emit方法，在组件通信时同时向 web component 调用方通信
const emitFn = Vue.prototype.$emit;
Vue.prototype.$emit = function(name, ...args) {
  if (this.$parent.baasComponentBroadcast) {
    this.$parent.baasComponentBroadcast(name, ...args);
  }
  emitFn.call(this, name, ...args);
};

const createBaasComponent = (com)=>{
  class BaasVueBase extends HTMLElement {
    static props;
    static component; // Vue组件
    vm; // Vue实例
    constructor() {
      super();
    }

    connectedCallback() {
      this.mount();
    }

    mount() {
      const content = document.createElement('div');
      this.appendChild(content);

      // 收集attributes
      const attributes = {};
      try {
        for (let i = 0; i < this.attributes.length; i++) {
          attributes[this.attributes[i].name] = this.attributes[i].value;
        }
      } catch (err) {
        console.error('err:', err);
      }
   
      const that = this;
      const vm = new Vue({
        el: content,
        data: attributes,
        methods: {
          baasComponentBroadcast(name, ...args) {
            that.dispatchEvent(new CustomEvent(name, { detail: args }));
          }
        },
        render(h) {
          return h(BaasVueBase.component, { props: attributes });
        }
      });
      this.vm = vm;
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
  BaasVueBase.props = Array.isArray(com.props) ? com.props : Object.keys(com.props);
  return BaasVueBase;
};
export default createBaasComponent;