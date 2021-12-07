
import Vue from 'baas-vue-runtime';
import vueWarp from './vue/index';

function createVueBaasComponent(component) {
  return vueWarp(Vue, component);
}
export {
  createVueBaasComponent
};