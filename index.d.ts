export = BTrackerClient;

type getAnnounceOptsFn = () => ({
  numwant?: number,
  uploaded?: number,
  downloaded?: number
})

type BTrackerClientOptions = {
  useP2P: boolean,
  trackerAnnounce: string[],
  simultaneousP2PLoads: number,
  p2pLoadTimeout: number,
  webRtcMaxMessageSize: number,
  getAnnounceOpts?: getAnnounceOptsFn,
  rtcConfig?: RTCConfiguration
}

declare class BTrackerClient {
  constructor(settings: any);
  complete(opts: any): void;
  destroy(cb?: any): any;
  scrape(opts: any): void;
  setInterval(intervalMs: any): void;
  start(opts?: any): void;
  stop(opts?: any): void;
  update(opts: any): void;

  // IEmitter
  on(eventName: string | symbol, listener: Function): this;
  off(eventName: string, listener: Function): this;
  emit(eventName: string, ...args: any[]): any;
  removeAllListeners(): void;

  static scrape(opts: any, cb: any): any;
}
