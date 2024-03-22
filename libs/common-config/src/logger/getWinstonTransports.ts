import { format, transports } from 'winston';
import { NodeEnv } from '@app/common-config/NodeEnv';

function getTextFormat(moduleName: string) {
  return format.combine(
    format.label({ label: `[${moduleName}]` }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    format.printf(
      ({ level, timestamp, message, label, ...meta }) =>
        // eslint-disable-next-line max-len
        `${timestamp} ${level} ${label} MESSAGE=${message}, TRACE_ID=${meta?.traceId}`,
    ),
  );
}

export function getWinstonTransports(nodeEnv: NodeEnv, moduleName: string) {
  const isLocalEnv = [NodeEnv.LOCAL, NodeEnv.TEST].includes(nodeEnv);
  const level = isLocalEnv ? 'debug' : 'info';

  const extraTransports = [];
  if (isLocalEnv)
    extraTransports.push(
      new transports.Console({
        level,
        format: getTextFormat(moduleName),
      }),
    );

  return [...extraTransports];
}
