import { AppName, PerformanceInterceptor, PerformanceLogSdkClass } from './type';


declare function performanceInterceptor(appName: any): PerformanceInterceptor;

declare class PerformanceLogSdk implements PerformanceLogSdkClass{
  isCompelete: boolean;
  // 是否是第一个加载的路由模块
  isFirstRouterModule: boolean;
  fcp: number | null;
  lcp: number | null;
  app: string | number;
  isRouterModule?: boolean;
  constructor(app: AppName);
  // new(appName: string, isRouterModule?: boolean | undefined): any;
  sendLog(eventName: string, parmas: Record<string, unknown>): any;
  sendFcp(): void;
  sendLcp(): void;
}

declare namespace performanceInterceptor {
  export {
    PerformanceLogSdk,
  }
}
export = performanceInterceptor;
export as namespace performanceInterceptor;