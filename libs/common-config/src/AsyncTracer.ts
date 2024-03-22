import { AsyncLocalStorage } from 'async_hooks';

export class AsyncTracer {
  private static als = new AsyncLocalStorage();

  static scope(traceId: string, callback: () => unknown): unknown {
    return this.als.run(traceId, callback);
  }

  static getTraceId(): string {
    return (this.als.getStore() as string) || '0';
  }
}
