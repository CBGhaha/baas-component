import Vue from '@baas-component-demo/vue-runtime';
import wrap from './warp/index.js';
export default function createVueBaasComponent(component) {
  return wrap(Vue, component);
}