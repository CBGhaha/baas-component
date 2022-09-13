import React, { Component } from 'react';
import Vue from 'baas-vue-runtime';

function injectHook (options, key, hook) {
  options[key] = [].concat(options[key] || []);
  options[key].unshift(hook);
}

export default function reactWarpperForVue(VueComponent) {
  const options = typeof VueComponent === 'function' ?
    VueComponent.options :
    VueComponent;
  injectHook(options, 'beforeCreate', function () {
    const emit = this.$emit;
    this.$emit = (name, ...args) => {
      if (this.$parent.baasComponentBroadcast) {
        this.$parent.baasComponentBroadcast(name, ...args);
      }
      return emit.call(this, name, ...args);
    };
  });
  return class WarpperComponent extends Component {
    constructor(props) {
      super(props);
      this.container = null;
      this.vm = null;
    }
    handleEvent(name, ...args) {
      if (this.props[name] && typeof this.props[name] === 'function') {
        this.props[name](...args);
      }
    }
    componentDidMount() {
      const that = this;
      this.vm = new Vue({
        el: this.container,
        data: {
          props: { ...that.props }
        },
        methods: {
          baasComponentBroadcast(name, ...args) {
            that.handleEvent(name, ...args);
          }
        },
        render(h) {
          return h(VueComponent, { props: this.props });
        }
      });
    }
    getSnapshotBeforeUpdate() {
      for (let i in this.props) {
        this.vm.props[i] = this.props[i];
      }
    }
    render() {
      return <div ref={e=> this.container = e}>

      </div>;
    }
  };
}
