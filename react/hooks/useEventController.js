/**
 * 使用规则：
 * 1:用于订阅qt发送来的事件消息 并在组件被销毁时取消监听
 * 2:只针对于被注册的事件（在controller-member中被注册）
*/

import { useEffect } from 'react';


export default function useEventController(eventControllersInstance, event, cb) {
  useEffect(()=>{
    const $controllers = eventControllersInstance.acceptSignMap[event];
    $controllers.forEach(controller=>{
      controller.on(event, cb);
    });
    return ()=>{
      $controllers.forEach(controller=>{
        controller.removeListener(event, cb);
      });
    };
  }, []);
}