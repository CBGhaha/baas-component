import Tea from 'byted-tea-sdk';
import { AppName, PerformanceInterceptor } from '../type';
Tea.init({
  app_id: 388665,
  channel: 'cn',
});
Tea.start();
const EVENT_NAME_PREFIX = 'life_performance';

export enum PerformanceEventName {
  render_app = 'render_app',
  check_permissions = 'check_permissions',
  http_request = 'http_request',
  app_render_result = 'render_result',
  resource_load = 'resource_load',
  fcp = 'fcp',
  lcp = 'lcp',
}

export enum ErrorCode {
  userinfo, // 获取用户信息错误
  permissions, // 权限接口校验错误
  httpRequest, // 接口请求错误
  other, // 其他未知错误
}

export default class PerformanceLogSdk{
  // 整个web应用首次初始化的时间
  private static webAppStartTime = window.performance.timing?.navigationStart || new Date().getTime();
  // 类的实例
  private static instance: PerformanceLogSdk | null = null;
  // web应用准备完毕时间(开始挂载业务的路由模块)
  private static webAppReadyInterval = 0;
  private static resourceLoadCompelete = false;
  // 模块加载是否结束
  isCompelete = false;
  // 是否是第一个加载的路由模块
  isFirstRouterModule = false;
  // 模块首次create的时间
  private moduleCreateTime = 0;

  fcp: number | null = null;
  lcp: number | null = null;
  app: AppName;
  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  constructor(app: AppName, isRouterModule?: boolean) {
    this.app = app;
    this.moduleCreateTime = new Date().getTime();
    if (isRouterModule) {
      if (!PerformanceLogSdk.instance) {
        this.isFirstRouterModule = true;
        PerformanceLogSdk.webAppReadyInterval = new Date().getTime() - PerformanceLogSdk.webAppStartTime;
      }
      PerformanceLogSdk.instance = this;
    }
  }

  // 发送路由级模块的性能埋点
  private static sendRouterModuleLog(eventName: string, payload?: Record<string, unknown>): Record<string, any> | void {
    try {
      const { webAppReadyInterval, webAppStartTime, instance } = PerformanceLogSdk;
      if (!instance?.app) {
        return;
      }
      if (!PerformanceLogSdk.resourceLoadCompelete) {
        PerformanceLogSdk.resourceLoadCompelete = true;
        PerformanceLogSdk.resourceLoad();
      }
     
      const appName = typeof instance.app === "function" ? instance.app() : instance.app;
      const params = {
        app: appName,
        time: new Date().getTime() - webAppStartTime,
        pid: window.location.pathname,
        interval: 0,
        ...(payload || {}),
      };
      if (instance) {
        if (!payload?.time) {
          params.time = new Date().getTime() - instance.moduleCreateTime + webAppReadyInterval;
        }
        params.interval = params.time - webAppReadyInterval;
      }
      Tea.event(`${EVENT_NAME_PREFIX}_${eventName}`, params);
      return params;
    } catch(err) {
      console.error(err);
    }
  }

  private static resourceLoad() {
    PerformanceLogSdk.sendRouterModuleLog(PerformanceEventName.resource_load, {
      time: PerformanceLogSdk.webAppReadyInterval
    });
  }

  // 应用开始render埋点上报
  static sendAppRender(): void {
    PerformanceLogSdk.sendRouterModuleLog(PerformanceEventName.render_app, {
      pid: window.location.pathname,
    });
  }

  // http请求responseInterceptor => 上报埋点
  static resInterceptor: PerformanceInterceptor = (res, req) => {
    let parmas = {};
    try {
      if (res && res.status_code === 0) {
        // 请求成功
        Object.assign(parmas, {
          requestUrl: req.url,
          status: 1,
          paddingTime: res.respJsTime - res.recvJsCallTime || 0,
          logid: res.log_id,
        })
      } else {
        // 请求失败
        Object.assign(parmas, {
          requestUrl: req.url,
          status: 0,
          logid: res?.log_id,
          errorDes: typeof res.error === 'object' ? JSON.stringify(res.error) : res.error,
        })
      }
      PerformanceLogSdk.sendRouterModuleLog(PerformanceEventName.http_request, parmas);
    } catch (err) {
      console.log(err);
    }
    return res;
  };

    // 处理失败
  handleFail(errorCode: ErrorCode, errorDes?: string): void {
    PerformanceLogSdk.sendRouterModuleLog(PerformanceEventName.app_render_result, {
      status: 0,
      errorCode,
      errorDes,
    });
  }

  // 发送自定义模块的性能埋点
  sendLog(eventName: string, parmas: Record<string, unknown>): void {
    const appName = typeof this.app === "function" ? this.app() : this.app;
    Tea.event(eventName, {
      app: appName,
      pid: window.location.pathname,
      time: new Date().getTime() - this.moduleCreateTime,
      ...parmas,
    });
  }

  // 发送fcp
  sendFcp() {
    this.fcp && PerformanceLogSdk.sendRouterModuleLog(PerformanceEventName.fcp, {
      value: this.fcp,
    });
  }
  // 发送lcp
  sendLcp() {
    if (this.lcp) {
      PerformanceLogSdk.sendRouterModuleLog(PerformanceEventName.lcp, {
        value: this.lcp,
      });
    }
  }
}