import TestVue from './test.vue';
import Vue from 'vue';
class TestComponent extends HTMLElement {
  constructor() {
    super();
    var content = document.createElement('div');
    this.appendChild(content);
    new Vue({
      el: content,
      render: h => h(TestVue)
    });

  }
}
window.customElements.define('test-component', TestComponent);