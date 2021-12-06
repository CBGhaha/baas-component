import Vue from 'baas-vue-runtime';
import wrap from '@vue/web-component-wrapper';
export default function createVueBaasComponent(component) {
  return wrap(Vue, component);
}