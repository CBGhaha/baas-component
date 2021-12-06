import React, { useState, useRef, useEffect } from 'react';
import './index.less';
import '@baas-component-demo/vue-runtime';
import '@baas-component-demo/vue-component';


export default function Component1() {
  const [name, setName] = useState('haha');
  const [mobile, setMobile] = useState(15811111111);
  const webComponetInstance = useRef();
  const reset = ()=>{
    setName('');
    setMobile('');
  };
  const handleSubmit = ()=>{
    console.log('handleSubmit-res');
  };
  useEffect(()=>{
    webComponetInstance.current.addEventListener('handleSubmit', (e)=>{
      console.log('handleSubmiti:', e.detail);
    });
  }, []);
  return <div className="component">
    React demo
    <div>
      <test-component2 ref={webComponetInstance} name={name} mobile={mobile} onHandleSubmit={handleSubmit}>
        <div slot="sss">i am solt</div>
      </test-component2>

    </div>
    <button onClick={reset}>重置</button>
  </div>;
}