import winston, { format } from "winston";
const { combine, timestamp,  printf , colorize, json} = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${ level }]: ${message}`;
});

const Logger = winston.createLogger({
    format: combine(
        timestamp({ format: 'hh:mm:ss DD-MM-YYYY' }),
        colorize(),
        json(),
        logFormat
    ),
   
    transports: [
        new winston.transports.Console(),
    ],
});

export default Logger;