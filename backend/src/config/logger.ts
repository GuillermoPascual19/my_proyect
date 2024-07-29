// logger.ts
import winston from 'winston';

const createLogger = (module: NodeModule) => {
  const path = module.filename.split('/').slice(-2).join('/');

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.label({ label: path }),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, label }: any) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console()
    ]
  });
};

export default createLogger;
