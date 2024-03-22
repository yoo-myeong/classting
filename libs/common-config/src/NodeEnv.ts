export enum NodeEnv {
  LOCAL = 'LOCAL',
  TEST = 'TEST',
  DEV = 'DEV',
  STAGING = 'STAGING',
  LIVE = 'LIVE',
}

export function getNodeEnv(env: string) {
  let nodeEnv: NodeEnv;
  switch (env) {
    case 'local':
      nodeEnv = NodeEnv.LOCAL;
      break;
    case 'development':
      nodeEnv = NodeEnv.DEV;
      break;
    case 'staging':
      nodeEnv = NodeEnv.STAGING;
      break;
    case 'live':
      nodeEnv = NodeEnv.LIVE;
      break;
    case 'test':
      nodeEnv = NodeEnv.TEST;
      break;
    default:
      throw new Error(`정의되지 않은 환경입니다 (${env})`);
  }
  return nodeEnv;
}
