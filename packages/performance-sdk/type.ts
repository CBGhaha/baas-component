type ProformanceResType = {
  status_code: number;
  respJsTime: number;
  recvJsCallTime: number;
  log_id: string;
  error: unknown
}


type ProformanceReqType = {
  url?: string;
}
export type AppName = string | number | (() => string | number)
export type PerformanceInterceptor = (res: ProformanceResType, req: ProformanceReqType) => any;
