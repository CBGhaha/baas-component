import { onLCP, onFCP } from 'web-vitals';
import merchant from '@bridge/ls_merchant';
import PerformanceLogSdk from './performanceLogSdk';
import { AppName, PerformanceInterceptor } from '../type';

let performanceInterceptorCreator: (app: string) => PerformanceInterceptor;
(function() {
  let instance: PerformanceLogSdk | null = null;
  let appLcp: null | number = null;
  let appFcp: null | number = null;
  try {
    onLCP((lcp: any) => {
      if (instance?.isFirstRouterModule) {
        instance.lcp = lcp.value;
        instance.sendLcp();
      } else {
        appLcp = lcp.value;
      }
    });
    onFCP((fcp: any) => {
      if (instance?.isFirstRouterModule) {
        instance.fcp = fcp.value;
        instance.sendFcp();
      } else {
        appFcp = fcp.value;
      }
    });
  } catch (err) {
    console.error(err);
  }

  const sendFcpAndLcp = () => {
    if (appLcp && instance) {
      instance.lcp = appLcp;
      instance.sendLcp();
      appLcp = null;
    }
    if (appFcp && instance) {
      instance.fcp = appFcp;
      instance.sendFcp();
      appFcp = null;
    }
  };

  merchant.on(
    'viewDisappeared',
    sendFcpAndLcp,
    true
  );

  performanceInterceptorCreator = function(config: any) {
    let app: AppName = '';
    if (config) {
      if (typeof config === 'string') {
        app = config;
      } else if (typeof config?.config === 'object') {
        app = () => config.config.bizCode;
      }
    }

    instance = new PerformanceLogSdk(app, true);
    sendFcpAndLcp();
    return PerformanceLogSdk.resInterceptor;
  };
})();


export default performanceInterceptorCreator;